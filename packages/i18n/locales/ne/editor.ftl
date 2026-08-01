# Nepali editor and language-server surfaces. Translated from
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
        [reset] रिसेट
       *[update] अद्यावधिक
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] दर्शक { $word }
       *[other] दर्शक { $word } { $shortcut }
    }


## The variant picker

editor-variant = संस्करण
editor-variant-filter = छान्नुहोस्...
editor-variant-next = अर्को संस्करण छान्नुहोस्
editor-variant-previous = अघिल्लो संस्करण छान्नुहोस्


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA पहुँचयोग्यता उल्लङ्घन पहिचान गरियो। पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द गर्न
           *[open] खोल्न
        } क्लिक गर्नुहोस्।
        [advisories] पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द गर्न
           *[open] खोल्न
        } क्लिक गर्नुहोस्। कुनै WCAG AA उल्लङ्घन भेटिएन, तर थप केही पहुँचयोग्यता सिफारिसहरू उपलब्ध छन्।
       *[clean] पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द गर्न
           *[open] खोल्न
        } क्लिक गर्नुहोस्। कुनै पहुँचयोग्यता समस्या भेटिएन।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA पहुँचयोग्यता उल्लङ्घन पहिचान गरियो। { $count ->
            [one] { $count } WCAG AA उल्लङ्घन
           *[other] { $count } WCAG AA उल्लङ्घन
        } भेटियो। पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द गर्न
           *[open] खोल्न
        } क्लिक गर्नुहोस्।
        [advisories] कुनै WCAG AA उल्लङ्घन पहिचान गरिएन। थप { $count ->
            [one] { $count } पहुँचयोग्यता सिफारिस
           *[other] { $count } पहुँचयोग्यता सिफारिस
        } भेटियो। पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द गर्न
           *[open] खोल्न
        } क्लिक गर्नुहोस्।
       *[clean] कुनै WCAG AA उल्लङ्घन पहिचान गरिएन। पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द गर्न
           *[open] खोल्न
        } क्लिक गर्नुहोस्।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML संस्करण { $version }

editor-tab-help = सन्दर्भअनुसार सहायता
editor-tab-help-short = सन्दर्भ
editor-tab-errors = त्रुटि
editor-tab-warnings = चेतावनी
editor-tab-info = जानकारी
editor-tab-accessibility = पहुँचयोग्यता
editor-tab-responses = पठाइएका उत्तर

editor-tab-with-count = { $label }: { $count }

editor-options = सम्पादक विकल्प
editor-format-as-doenetml = DoenetML को रूपमा मिलाउनुहोस्
editor-format-as-xml = XML को रूपमा मिलाउनुहोस्


## The diagnostics panel

editor-diagnostic-line = पङ्क्ति #{ $line }

editor-no-errors = कुनै त्रुटि छैन
editor-no-warnings = कुनै चेतावनी छैन
editor-no-info = कुनै जानकारीमूलक निर्देशन छैन

editor-show-info-annotations = सम्पादकमा जानकारीमूलक निर्देशन देखाउनुहोस्
editor-show-accessibility-annotations = सम्पादकमा पहुँचयोग्यता निर्देशन देखाउनुहोस्

editor-accessibility-learn-more = Doenet ले पहुँचयोग्यतालाई कसरी हेर्छ जान्नुहोस्

editor-accessibility-violations-heading = पहुँचयोग्यता उल्लङ्घन ({ $standard })

editor-accessibility-other-heading = अन्य पहुँचयोग्यता समस्या
editor-none-found = केही भेटिएन


## Submitted responses

editor-no-responses = अहिलेसम्म कुनै उत्तर पठाइएको छैन
editor-response-answer-id = उत्तरको आईडी
editor-response-response = उत्तर
editor-response-credit = अंक
editor-response-submitted = पठाइयो


## The context-help panel

help-placeholder = कागजातका लागि कर्सर ट्यागको नाम, एट्रिब्युट वा { $ref } मा राख्नुहोस्।

help-unsupported-ref-chain = { $example } जस्ता बहु-भागे सन्दर्भका लागि सहायता अझै उपलब्ध छैन।

help-unresolved-ref =
    { $reason ->
        [notFound] सन्दर्भका लागि कुनै लक्ष्य भेटिएन: { $ref }।
        [multiple] सन्दर्भका लागि धेरै लक्ष्य भेटिए: { $ref }।
       *[indeterminate] { $ref } को लक्ष्य निर्धारण गर्न सकिएन।
    }

help-learn-about-references = सन्दर्भबारे जान्नुहोस् →
help-reference-page = सन्दर्भ पृष्ठ →

help-suggestions-header =
    { $location ->
        [inside] { $element } भित्र
       *[top] सर्वोच्च तहमा
    }{ $allowed ->
        [none] { " — यहाँ केही पनि अटाउँदैन।" }
        [text] { " — यहाँ पाठ लेख्नुहोस्।" }
        [text-and-components] { " — यहाँ पाठ लेख्नुहोस्, वा यी प्रयास गर्नुहोस्:" }
       *[components] { " — यी प्रयास गर्नुहोस्:" }
    }

help-suggestions-footer = सबै { $total } घटक हेर्न { $shortcut } थिच्नुहोस्।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } को सन्दर्भ हो।
       *[other] { $ref } { $target } को सन्दर्भ हो (पङ्क्ति { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ले यसलाई { $role } को रूपमा ल्यायो।
       *[other] { $owner } ले यसलाई पङ्क्ति { $line } मा { $role } को रूपमा ल्यायो।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } को { $property } गुणको सन्दर्भ हो।
       *[other] { $ref } { $element } को { $property } गुणको सन्दर्भ हो (पङ्क्ति { $line })।
    }

help-kind-attribute = एट्रिब्युट
help-kind-snippet = स्निपेट
help-kind-array-entry = एरे प्रविष्टि

help-default = पूर्वनिर्धारित:
help-active-default = सक्रिय पूर्वनिर्धारित:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] अनुमत मान (प्रत्येक वस्तुका लागि एक):
       *[other] अनुमत मान:
    }

help-suggested-values = सुझाइएका मान:

help-inserts = यसले राख्छ:

help-coordinates =
    { $count ->
        [one] निर्देशाङ्क:
       *[other] निर्देशाङ्क:
    }

help-type = प्रकार:

help-resolved-style = निर्धारित शैली (styleNumber { $styleNumber }):

help-resolved-function-names = निर्धारित फलनका नाम:
help-reset-list = यो इनपुटमा सूची रिसेट:
help-added-on-input = यो इनपुटमा थपियो:
help-removed-on-input = यो इनपुटमा हटाइयो:

help-reset-overrides = { $reset } ले { $additional } र { $removed } माथि प्राथमिकता पाउँछ।
