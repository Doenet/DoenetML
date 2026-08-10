# Bodo editor and language-server surfaces: the footer, the diagnostics panel,
# the variant picker, the accessibility button, and the context-help panel
# beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] फिन थि खालाम
       *[update] दानै खालाम
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] नुग्राखौ { $word }
       *[other] नुग्राखौ { $word } { $shortcut }
    }


## The variant picker

editor-variant = रोखोम

editor-variant-filter = सान…

editor-variant-next = उननि रोखोम बासिख

editor-variant-previous = आगोलनि रोखोम बासिख


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA मोनथाव जायगानि गोरोन्थि मोनखांबाय। मोनथाव जायगानि रिपर्ट { $action ->
            [close] बन्द खालामनो
           *[open] खेवनो
        } क्लिक खालाम।
        [advisories] मोनथाव जायगानि रिपर्ट { $action ->
            [close] बन्द खालामनो
           *[open] खेवनो
        } क्लिक खालाम। जेबो WCAG AA गोरोन्थि मोनाखै, नाथाय गोबाव मोनथाव जायगानि राय दं।
       *[clean] मोनथाव जायगानि रिपर्ट { $action ->
            [close] बन्द खालामनो
           *[open] खेवनो
        } क्लिक खालाम। जेबो मोनथाव जायगानि जटिलता मोनाखै।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA मोनथाव जायगानि गोरोन्थि मोनखांबाय। { $count ->
            [one] { $count } WCAG AA गोरोन्थि
           *[other] { $count } WCAG AA गोरोन्थि
        } मोनखांबाय। मोनथाव जायगानि रिपर्ट { $action ->
            [close] बन्द खालामनो
           *[open] खेवनो
        } क्लिक खालाम।
        [advisories] जेबो WCAG AA गोरोन्थि मोनाखै। { $count ->
            [one] { $count } गोबाव मोनथाव जायगानि राय
           *[other] { $count } गोबाव मोनथाव जायगानि राय
        } मोनखांबाय। मोनथाव जायगानि रिपर्ट { $action ->
            [close] बन्द खालामनो
           *[open] खेवनो
        } क्लिक खालाम।
       *[clean] जेबो WCAG AA गोरोन्थि मोनाखै। मोनथाव जायगानि रिपर्ट { $action ->
            [close] बन्द खालामनो
           *[open] खेवनो
        } क्लिक खालाम।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML बिसन { $version }

editor-tab-help = सोमोन्दोजों मददनि
editor-tab-help-short = सोमोन्दो
editor-tab-errors = गोरोन्थि
editor-tab-warnings = सांग्रांथि
editor-tab-info = फोरमायथिहोग्रा
editor-tab-accessibility = मोनथाव जायगा
editor-tab-responses = दैथायखानाय फिन

editor-tab-with-count = { $label }: { $count }

editor-options = सम्पादक बासिखथाय
editor-format-as-doenetml = DoenetML बादि थि खालाम
editor-format-as-xml = XML बादि थि खालाम


## The diagnostics panel

editor-diagnostic-line = सारि #{ $line }

editor-no-errors = जेबो गोरोन्थि गैया
editor-no-warnings = जेबो सांग्रांथि गैया
editor-no-info = जेबो फोरमायथिहोग्रा गैया

editor-show-info-annotations = सम्पादकआव फोरमायथिहोग्रा दिन्थि
editor-show-accessibility-annotations = सम्पादकआव मोनथाव जायगानि सांग्रांथि दिन्थि

editor-accessibility-learn-more = Doenet मोनथाव जायगाखौ माबोरै नायो, बेखौ सोलों

editor-accessibility-violations-heading = मोनथाव जायगानि गोरोन्थि ({ $standard })

editor-accessibility-other-heading = गुबुन मोनथाव जायगानि जटिलता
editor-none-found = जेबो मोनाखै


## Submitted responses

editor-no-responses = दासिम जेबो फिन दैथायाखै
editor-response-answer-id = फिन आइडि
editor-response-response = फिन
editor-response-credit = नम्बर
editor-response-submitted = दैथायबाय


## The context-help panel

help-placeholder = दस्ताबेजनि थाखाय कर्सरखौ टेग मुं, आखुथाय, एबा { $ref }आव दोन।

help-unsupported-ref-chain = { $example } बादि गोबां बाहागोनि सोमोन्दोनि थाखाय मदद दासिम गैया।

help-unresolved-ref =
    { $reason ->
        [notFound] बे सोमोन्दोनि जेबो थांखि मोनाखै: { $ref }।
        [multiple] बे सोमोन्दोनि गोबां थांखि मोनखांबाय: { $ref }।
       *[indeterminate] { $ref }नि थांखि थि खालामनो हायाखै।
    }

help-learn-about-references = सोमोन्दोनि सोमोन्दै सोलों →
help-reference-page = सोमोन्दो बिलाइ →

help-suggestions-header =
    { $location ->
        [inside] { $element }नि सिङाव
       *[top] गोजौसिननि थाखोआव
    }{ $allowed ->
        [none] { " — बेयाव जेबो फैनो हाया।" }
        [text] { " — बेयाव फोरमायथिहोग्रा लिर।" }
        [text-and-components] { " — बेयाव फोरमायथिहोग्रा लिर, एबा बेफोरखौ नाजा:" }
       *[components] { " — बेफोरखौ नाजा:" }
    }

help-suggestions-footer = गासै { $total } बाहागोखौ नुनो { $shortcut } नाब।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } जायो { $target }नि सोमोन्दो।
       *[other] { $ref } जायो { $target }नि सोमोन्दो (सारि { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner }जों { $role } बादि लाबोखानाय।
       *[other] { $owner }जों सारि { $line }आव { $role } बादि लाबोखानाय।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } जायो { $element }नि { $property } गुननि सोमोन्दो।
       *[other] { $ref } जायो { $element }नि { $property } गुननि सोमोन्दो (सारि { $line })।
    }

help-kind-attribute = आखुथाय
help-kind-snippet = बाहागो
help-kind-array-entry = सारनी प्रबिष्टि

help-default = गुबै:
help-active-default = मावथिगोनां गुबै:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] गनायथि होनाय बेसेन (मोनफ्रोम बेसादनि मोनसे):
       *[other] गनायथि होनाय बेसेन:
    }

help-suggested-values = राय होनाय बेसेन:

help-inserts = हाबहोयो:

help-coordinates =
    { $count ->
        [one] निर्देशांक:
       *[other] निर्देशांक:
    }

help-type = रोखोम:

help-resolved-style = थि खालामनाय आदब (styleNumber { $styleNumber }):

help-resolved-function-names = थि खालामनाय फलन मुं:
help-reset-list = बे हाबहोनायाव फिन थि खालामनाय लिस्ट:
help-added-on-input = बे हाबहोनायाव दाजाबखानाय:
help-removed-on-input = बे हाबहोनायाव बोखारखानाय:

help-reset-overrides = { $reset }आ { $additional } आरो { $removed }नि गोजौआव थायो।
