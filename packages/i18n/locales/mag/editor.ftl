# Magahi (मगही) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script, frame and register** are `chrome.ftl`'s: Devanagari with Latin
# digits; a Magahi frame — «हइ», «ना», «के», «आउ», «लेल», «काहेकि», «तेकरा
# लेल», «में», «ई», «कोनो», «जे», «सब» and the **-ल** participles — around a
# Hindi and Sanskrit technical vocabulary that is declared rather than
# disguised. Buttons carry the honorific imperative in **-ू** («देखावू»,
# «दबावू», «राखू», «चुनू»).
#
# **`WCAG`, `DoenetML`, `XML`, `styleNumber` and every element and attribute
# name stay in English.** They are identifiers an author types, not words.
#
# **The counts do not fork.** `editor-accessibility-label` and
# `help-coordinates` drop the `$count` selector English writes and give one
# form outright — `help-coordinates` is a plain message, and
# `editor-accessibility-label` interpolates `{ $count }` without selecting
# on it: CLDR has no plural data for `mag`, so an English-selected
# branch would be worse than none, and a Magahi noun is unmarked after a
# numeral in any case.
#
# **`help-name-summary` is punctuation.** It renders with `{ $name }` empty
# for a suggestion the panel has already named, so the em dash and its spaces
# have to read on their own.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] रीसेट करू
       *[update] अद्यतन करू
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] दर्सक { $word }
       *[other] दर्सक { $word } { $shortcut }
    }


## The variant picker

editor-variant = रूपांतर
editor-variant-filter = छानू...
editor-variant-next = अगला रूपांतर चुनू
editor-variant-previous = पहिले वाला रूपांतर चुनू


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन मिलल। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } लेल क्लिक करू।
        [advisories] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } लेल क्लिक करू। कोनो WCAG AA उल्लंघन ना मिलल, बाकिर सुगम्यता के आउ सुझाव हइ।
       *[clean] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } लेल क्लिक करू। कोनो सुगम्यता के समस्या ना मिलल।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन मिलल। { $count } WCAG AA उल्लंघन मिलल। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } लेल क्लिक करू।
        [advisories] कोनो WCAG AA उल्लंघन ना मिलल। सुगम्यता के { $count } आउ सुझाव मिलल। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } लेल क्लिक करू।
       *[clean] कोनो WCAG AA उल्लंघन ना मिलल। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } लेल क्लिक करू।
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
editor-tab-responses = पठावल गेल जवाब

editor-tab-with-count = { $label }: { $count }

editor-options = संपादक के विकल्प
editor-format-as-doenetml = DoenetML के रूप में सजावू
editor-format-as-xml = XML के रूप में सजावू


## The diagnostics panel

editor-diagnostic-line = पंक्ति #{ $line }

editor-no-errors = कोनो त्रुटि ना
editor-no-warnings = कोनो चेतावनी ना
editor-no-info = कोनो सूचनात्मक निदान ना

editor-show-info-annotations = संपादक में सूचनात्मक निदान देखावू
editor-show-accessibility-annotations = संपादक में सुगम्यता के निदान देखावू

editor-accessibility-learn-more = जानू कि Doenet सुगम्यता के कइसे देखऽ हइ

editor-accessibility-violations-heading = सुगम्यता उल्लंघन ({ $standard })

editor-accessibility-other-heading = सुगम्यता के आउ समस्या
editor-none-found = कुछ ना मिलल


## Submitted responses

editor-no-responses = अखने तक कोनो जवाब ना पठावल गेल
editor-response-answer-id = जवाब के आईडी
editor-response-response = जवाब
editor-response-credit = अंक
editor-response-submitted = पठावल गेल


## The context-help panel

help-placeholder = दस्तावेजीकरण देखे लेल कर्सर के कोनो टैग नाम, विशेषता या { $ref } पर राखू।

help-unsupported-ref-chain = { $example } जइसे बहु-भागी संदर्भ के मदद अखने ना हइ।

help-unresolved-ref =
    { $reason ->
        [notFound] ई संदर्भ के कोनो लक्ष्य ना मिलल: { $ref }।
        [multiple] ई संदर्भ के कई लक्ष्य मिलल: { $ref }।
       *[indeterminate] { $ref } के लक्ष्य तय ना कएल जा सकल।
    }

help-learn-about-references = संदर्भ के बारे में जानू →
help-reference-page = संदर्भ के पन्ना →

help-suggestions-header =
    { $location ->
        [inside] { $element } के भीतर
       *[top] सबसे ऊपर के स्तर पर
    }{ $allowed ->
        [none] { " — इहाँ कुछ ना राखा जा सकऽ हइ।" }
        [text] { " — इहाँ पाठ लिखा जा सकऽ हइ हइ।" }
        [text-and-components] { " — इहाँ पाठ लिखू, या ई आजमावू:" }
       *[components] { " — ई आजमावू:" }
    }

help-suggestions-footer = सब { $total } घटक देखे लेल { $shortcut } दबावू।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref }, { $target } के संदर्भ हइ।
       *[other] { $ref }, { $target } के संदर्भ हइ (पंक्ति { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } { $role } के रूप में एकरा लावा।
       *[other] { $owner } पंक्ति { $line } में { $role } के रूप में एकरा लावा।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref }, { $element } के { $property } गुण के संदर्भ हइ।
       *[other] { $ref }, { $element } के { $property } गुण के संदर्भ हइ (पंक्ति { $line })।
    }

help-kind-attribute = विशेषता
help-kind-snippet = कोड के टुकड़ा
help-kind-array-entry = सरणी के प्रविष्टि

help-default = पूर्वनिर्धारित:
help-active-default = चालू पूर्वनिर्धारित:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] मान्य मान (हर मद लेल एक):
       *[other] मान्य मान:
    }

help-suggested-values = सुझावल मान:

help-inserts = जोड़ऽ हइ:

help-coordinates = निर्देशांक:

help-type = प्रकार:

help-resolved-style = तय शैली (styleNumber { $styleNumber }):

help-resolved-function-names = तय फलन नाम:
help-reset-list = ई इनपुट के रीसेट सूची:
help-added-on-input = ई इनपुट पर जोड़ा गेल:
help-removed-on-input = ई इनपुट पर हटावा गेल:

help-reset-overrides = { $reset }, { $additional } आउ { $removed } पर भारी परऽ हइ।
