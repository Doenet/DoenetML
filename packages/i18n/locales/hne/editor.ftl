# Chhattisgarhi (छत्तीसगढ़ी) editor and language-server surfaces: the footer,
# the diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script, frame and register** are `chrome.ftl`'s: Devanagari with Latin
# digits; a Chhattisgarhi frame — «हे», «नइ», «के», «अउ», «बर», «काबर के»,
# «तेकर सेती», «ले», «ला», «ए», «कोनो», «मन» — around a Hindi and Sanskrit
# technical vocabulary that is declared rather than disguised. Buttons carry
# the honorific imperative in **-व** («देखावव», «दबावव», «राखव», «चुनव»).
#
# **`WCAG`, `DoenetML`, `XML`, `styleNumber` and every element and attribute
# name stay in English.** They are identifiers an author types, not words.
#
# **The counts do not fork.** `editor-accessibility-label` and
# `help-coordinates` write a single `*[other]` where English writes `[one]`
# and `[other]`: CLDR has no plural data for `hne`, so an English-selected
# branch would be worse than none, and a Chhattisgarhi noun is unmarked after
# a numeral in any case.
#
# **`help-name-summary` is punctuation.** It renders with `{ $name }` empty
# for a suggestion the panel has already named, so the em dash and its spaces
# have to read on their own.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] रीसेट करव
       *[update] अद्यतन करव
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] दर्सक { $word }
       *[other] दर्सक { $word } { $shortcut }
    }


## The variant picker

editor-variant = रूपांतर
editor-variant-filter = छानव...
editor-variant-next = अगला रूपांतर चुनव
editor-variant-previous = पहिली वाला रूपांतर चुनव


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन मिलिस। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } बर क्लिक करव।
        [advisories] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } बर क्लिक करव। कोनो WCAG AA उल्लंघन नइ मिलिस, पर सुगम्यता के अउ सुझाव हें।
       *[clean] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } बर क्लिक करव। कोनो सुगम्यता के समस्या नइ मिलिस।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन मिलिस। { $count } WCAG AA उल्लंघन मिलिन। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } बर क्लिक करव।
        [advisories] कोनो WCAG AA उल्लंघन नइ मिलिस। सुगम्यता के { $count } अउ सुझाव मिलिन। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } बर क्लिक करव।
       *[clean] कोनो WCAG AA उल्लंघन नइ मिलिस। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } बर क्लिक करव।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML संस्करण { $version }

editor-tab-help = प्रसंग के हिसाब से मदद
editor-tab-help-short = प्रसंग
editor-tab-errors = त्रुटि
editor-tab-warnings = चेतावनी
editor-tab-info = जानकारी
editor-tab-accessibility = सुगम्यता
editor-tab-responses = पठावल गे जवाब

editor-tab-with-count = { $label }: { $count }

editor-options = संपादक के विकल्प
editor-format-as-doenetml = DoenetML के रूप म सजावव
editor-format-as-xml = XML के रूप म सजावव


## The diagnostics panel

editor-diagnostic-line = पंक्ति #{ $line }

editor-no-errors = कोनो त्रुटि नइ
editor-no-warnings = कोनो चेतावनी नइ
editor-no-info = कोनो सूचनात्मक निदान नइ

editor-show-info-annotations = संपादक म सूचनात्मक निदान देखावव
editor-show-accessibility-annotations = संपादक म सुगम्यता के निदान देखावव

editor-accessibility-learn-more = जानव कि Doenet सुगम्यता ला कइसे देखथे

editor-accessibility-violations-heading = सुगम्यता उल्लंघन ({ $standard })

editor-accessibility-other-heading = सुगम्यता के अउ समस्या
editor-none-found = कुछ नइ मिलिस


## Submitted responses

editor-no-responses = अभी तक कोनो जवाब नइ पठावल गिस
editor-response-answer-id = जवाब के आईडी
editor-response-response = जवाब
editor-response-credit = अंक
editor-response-submitted = पठावल गिस


## The context-help panel

help-placeholder = दस्तावेजीकरण देखे बर कर्सर ला कोनो टैग नाम, विशेषता या { $ref } पर राखव।

help-unsupported-ref-chain = { $example } जइसे बहु-भागी संदर्भ के मदद अभी नइ हे।

help-unresolved-ref =
    { $reason ->
        [notFound] ए संदर्भ के कोनो लक्ष्य नइ मिलिस: { $ref }।
        [multiple] ए संदर्भ के कई लक्ष्य मिलिन: { $ref }।
       *[indeterminate] { $ref } के लक्ष्य तय नइ करे जा सकिस।
    }

help-learn-about-references = संदर्भ के बारे म जानव →
help-reference-page = संदर्भ के पन्ना →

help-suggestions-header =
    { $location ->
        [inside] { $element } के भीतर
       *[top] सबसे ऊपर के स्तर पर
    }{ $allowed ->
        [none] { " — इहाँ कुछ नइ राखा जा सकय।" }
        [text] { " — इहाँ पाठ लिखा जा सकय हे।" }
        [text-and-components] { " — इहाँ पाठ लिखव, या ए आजमावव:" }
       *[components] { " — ए आजमावव:" }
    }

help-suggestions-footer = सब { $total } घटक देखे बर { $shortcut } दबावव।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref }, { $target } के संदर्भ हे।
       *[other] { $ref }, { $target } के संदर्भ हे (पंक्ति { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } { $role } के रूप म एला लावा।
       *[other] { $owner } पंक्ति { $line } म { $role } के रूप म एला लावा।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref }, { $element } के { $property } गुण के संदर्भ हे।
       *[other] { $ref }, { $element } के { $property } गुण के संदर्भ हे (पंक्ति { $line })।
    }

help-kind-attribute = विशेषता
help-kind-snippet = कोड के टुकड़ा
help-kind-array-entry = सरणी के प्रविष्टि

help-default = पूर्वनिर्धारित:
help-active-default = चालू पूर्वनिर्धारित:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] मान्य मान (हर मद बर एक):
       *[other] मान्य मान:
    }

help-suggested-values = सुझावल मान:

help-inserts = जोड़थे:

help-coordinates = निर्देशांक:

help-type = प्रकार:

help-resolved-style = तय शैली (styleNumber { $styleNumber }):

help-resolved-function-names = तय फलन नाम:
help-reset-list = ए इनपुट के रीसेट सूची:
help-added-on-input = ए इनपुट पर जोड़ा गिस:
help-removed-on-input = ए इनपुट पर हटावा गिस:

help-reset-overrides = { $reset }, { $additional } अउ { $removed } पर भारी परथे।
