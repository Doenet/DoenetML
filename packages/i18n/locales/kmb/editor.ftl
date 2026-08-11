# Kimbundu editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Vutula
       *[update] Sokolola
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } o Mulondekesi
       *[other] { $word } o Mulondekesi { $shortcut }
    }


## The variant picker

editor-variant = Kifwa

editor-variant-filter = Sota…

editor-variant-next = Sola kifwa kya kaya

editor-variant-previous = Sola kifwa kya bhitile


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kwa sangwa kubhengela kwa WCAG AA mu kubhixila. Kwata phala { $action ->
            [close] kujika
           *[open] kujikula
        } o divulu dya kubhixila.
        [advisories] Kwata phala { $action ->
            [close] kujika
           *[open] kujikula
        } o divulu dya kubhixila. Ki kwa sangelwe kubhengela kwa WCAG AA ko, maji kwala ilongesu ya mukwa ya kubhixila.
       *[clean] Kwata phala { $action ->
            [close] kujika
           *[open] kujikula
        } o divulu dya kubhixila. Ki kwa sangelwe kibhidi kya kubhixila ko.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kwa sangwa kubhengela kwa WCAG AA mu kubhixila. Kwa sangwa { $count ->
            [one] kubhengela { $count } kwa WCAG AA
           *[other] kubhengela { $count } kwa WCAG AA
        }. Kwata phala { $action ->
            [close] kujika
           *[open] kujikula
        } o divulu dya kubhixila.
        [advisories] Ki kwa sangelwe kubhengela kwa WCAG AA ko. Kwa sangwa { $count ->
            [one] kilongesu { $count } kya mukwa kya kubhixila
           *[other] ilongesu { $count } ya mukwa ya kubhixila
        }. Kwata phala { $action ->
            [close] kujika
           *[open] kujikula
        } o divulu dya kubhixila.
       *[clean] Ki kwa sangelwe kubhengela kwa WCAG AA ko. Kwata phala { $action ->
            [close] kujika
           *[open] kujikula
        } o divulu dya kubhixila.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Kifwa kya DoenetML { $version }

editor-tab-help = Kikwatekesu kya kididi
editor-tab-help-short = Kididi
editor-tab-errors = Ibhengelu
editor-tab-warnings = Idimbu
editor-tab-info = Ijimbwete
editor-tab-accessibility = Kubhixila
editor-tab-responses = Itambwijilu ya tumwa

editor-tab-with-count = { $label }: { $count }

editor-options = Isolelu ya musoneki
editor-format-as-doenetml = Sokolola kála DoenetML
editor-format-as-xml = Sokolola kála XML


## The diagnostics panel

editor-diagnostic-line = Nlonji #{ $line }

editor-no-errors = Ki Kwala Ibhengelu ko
editor-no-warnings = Ki Kwala Idimbu ko
editor-no-info = Ki Kwala Ijimbwete ko

editor-show-info-annotations = Londekesa ijimbwete mu musoneki
editor-show-accessibility-annotations = Londekesa ibhidi ya kubhixila mu musoneki

editor-accessibility-learn-more = Dilonga kyebhi Doenet i tala o kubhixila

editor-accessibility-violations-heading = Kubhengela kwa kubhixila ({ $standard })

editor-accessibility-other-heading = Ibhidi ya mukwa ya kubhixila
editor-none-found = Ki kwa sangelwe kima ko


## Submitted responses

editor-no-responses = Ki kwala itambwijilu ya tumwa hanji ko
editor-response-answer-id = Dijina dya kitambwijilu
editor-response-response = Kitambwijilu
editor-response-credit = Mbandu
editor-response-submitted = Kya tumwa


## The context-help panel

help-placeholder = Bhaka o kimbanza mu dijina dya tag, mu attribute, mba mu { $ref } phala kusanga o kijilu.

help-unsupported-ref-chain = O kikwatekesu kya izwelu ya itangana yavulu kála { $example } ki kyala hanji ko.

help-unresolved-ref =
    { $reason ->
        [notFound] Ki kwa sangelwe kima kya { $ref } ko.
        [multiple] Kwa sangwa ima yavulu ya { $ref }.
       *[indeterminate] Ki kwa tenene kwijiya o kima kya { $ref } ko.
    }

help-learn-about-references = Dilonga ia izwelu →
help-reference-page = Kibhamba kya kijilu →

help-suggestions-header =
    { $location ->
        [inside] Mukwa { $element }
       *[top] Ku bhulu dya divulu
    }{ $allowed ->
        [none] { " — ki kwala kima ki kaya bhabha ko." }
        [text] { " — soneka izwelu bhabha." }
        [text-and-components] { " — soneka izwelu bhabha, mba tala:" }
       *[components] { " — ima i utena kutala:" }
    }

help-suggestions-footer = Kwata { $shortcut } phala kutala ima { $total } yoso.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } kizwelu kya kuya ku { $target }.
       *[other] { $ref } kizwelu kya kuya ku { $target } (nlonji { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } wa ki bhana kála { $role }.
       *[other] { $owner } wa ki bhana mu nlonji { $line } kála { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } kizwelu kya kuya ku kima { $property } kya { $element }.
       *[other] { $ref } kizwelu kya kuya ku kima { $property } kya { $element } (nlonji { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = kitangana
help-kind-array-entry = kitangana kya array

help-default = Kyala dyanga:
help-active-default = Kyala dyanga ni kya kalakala:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ima ya tanwa (kimoxi ku kima kimoxi):
       *[other] Ima ya tanwa:
    }

help-suggested-values = Ima ya londekeswa:

help-inserts = I bhakela:

help-coordinates =
    { $count ->
        [one] Kididi:
       *[other] Ididi:
    }

help-type = Kifwa:

help-resolved-style = Kifwa kya sangwa (styleNumber { $styleNumber }):

help-resolved-function-names = Majina ma funsau ma sangwa:
help-reset-list = Vutula o kilundu mu input yiyi:
help-added-on-input = Kya bhakelwa mu input yiyi:
help-removed-on-input = Kya katulwa mu input yiyi:

help-reset-overrides = { $reset } i bhita { $additional } ni { $removed }.
