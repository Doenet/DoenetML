# Venda editor and language-server surfaces: the footer, the diagnostics panel,
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
        [reset] Vhuyedzedza
       *[update] Swayisa
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Tshisumbedzi
       *[other] { $word } Tshisumbedzi { $shortcut }
    }


## The variant picker

editor-variant = Lushaka

editor-variant-filter = Sefa…

editor-variant-next = Nanga lushaka lu tevhelaho

editor-variant-previous = Nanga lushaka lwo fhiraho


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ho wanala u pfuka ha WCAG AA ha u swikelela. Puṱedza u { $action ->
            [close] vala
           *[open] vula
        } muvhigo wa u swikelela.
        [advisories] Puṱedza u { $action ->
            [close] vala
           *[open] vula
        } muvhigo wa u swikelela. A ho ngo wanala u pfuka ha WCAG AA, fhedzi hu na dzinyeletshedzo dziṅwe dza u swikelela.
       *[clean] Puṱedza u { $action ->
            [close] vala
           *[open] vula
        } muvhigo wa u swikelela. A ho ngo wanala thaidzo dza u swikelela.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ho wanala u pfuka ha WCAG AA ha u swikelela. Ho wanala { $count ->
            [one] u pfuka ha WCAG AA ha { $count }
           *[other] u pfuka ha WCAG AA ha { $count }
        }. Puṱedza u { $action ->
            [close] vala
           *[open] vula
        } muvhigo wa u swikelela.
        [advisories] A ho ngo wanala u pfuka ha WCAG AA. Ho wanala { $count ->
            [one] nyeletshedzo iṅwe ya u swikelela ya { $count }
           *[other] dzinyeletshedzo dziṅwe dza u swikelela dza { $count }
        }. Puṱedza u { $action ->
            [close] vala
           *[open] vula
        } muvhigo wa u swikelela.
       *[clean] A ho ngo wanala u pfuka ha WCAG AA. Puṱedza u { $action ->
            [close] vala
           *[open] vula
        } muvhigo wa u swikelela.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vheseni ya DoenetML { $version }

editor-tab-help = Thuso ya vhuimo
editor-tab-help-short = Vhuimo
editor-tab-errors = Vhukhakhi
editor-tab-warnings = Dzitsevho
editor-tab-info = Mafhungo
editor-tab-accessibility = U swikelela
editor-tab-responses = Dziphindulo dzo rumelwaho

editor-tab-with-count = { $label }: { $count }

editor-options = Khetho dza muṅwalululi
editor-format-as-doenetml = Dzudzanya sa DoenetML
editor-format-as-xml = Dzudzanya sa XML


## The diagnostics panel

editor-diagnostic-line = Mutalo #{ $line }

editor-no-errors = A Hu Na Vhukhakhi
editor-no-warnings = A Hu Na Dzitsevho
editor-no-info = A Hu Na Mafhungo

editor-show-info-annotations = Sumbedza mafhungo kha muṅwalululi
editor-show-accessibility-annotations = Sumbedza dzitsevho dza u swikelela kha muṅwalululi

editor-accessibility-learn-more = Guda nḓila ine Doenet ya sedza u swikelela ngayo

editor-accessibility-violations-heading = U pfuka ha u swikelela ({ $standard })

editor-accessibility-other-heading = Dziṅwe thaidzo dza u swikelela
editor-none-found = A ho ngo wanala tshithu


## Submitted responses

editor-no-responses = A hu na dziphindulo dzo rumelwaho ha u swika zwino
editor-response-answer-id = Aidi ya Phindulo
editor-response-response = Phindulo
editor-response-credit = Mavhege
editor-response-submitted = Yo rumelwa


## The context-help panel

help-placeholder = Vhea khesa kha dzina ḽa thegi, tshiteṅwa, kana { $ref } uri ni wane maṅwalwa.

help-unsupported-ref-chain = Thuso ya masumbedzo a zwipiḓa zwinzhi sa { $example } a i athu tikedzwa.

help-unresolved-ref =
    { $reason ->
        [notFound] A ho ngo wanala tshithu kha tshisumbedzo itshi: { $ref }.
        [multiple] Ho wanala zwithu zwinzhi kha tshisumbedzo itshi: { $ref }.
       *[indeterminate] Zwine { $ref } ya zwi sumbedza a zwo ngo kona u wanala.
    }

help-learn-about-references = Guda nga ha masumbedzo →
help-reference-page = Siaṱari ḽa tshisumbedzo →

help-suggestions-header =
    { $location ->
        [inside] Nga ngomu ha { $element }
       *[top] Nṱha ha zwoṱhe
    }{ $allowed ->
        [none] { " — a hu na tshithu tshine tsha ya afha." }
        [text] { " — ṅwala maṅwalwa afha." }
        [text-and-components] { " — ṅwala maṅwalwa afha, kana ni lingedze:" }
       *[components] { " — zwithu zwine na nga zwi lingedza:" }
    }

help-suggestions-footer = Puṱedza { $shortcut } u vhona zwiteṅwa zwoṱhe zwa { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ndi tshisumbedzo tsha { $target }.
       *[other] { $ref } ndi tshisumbedzo tsha { $target } (mutalo { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Yo ḓiswa nga { $owner } sa { $role }.
       *[other] Yo ḓiswa nga { $owner } kha mutalo { $line } sa { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ndi tshisumbedzo tsha tshiteṅwa tsha { $property } tsha { $element }.
       *[other] { $ref } ndi tshisumbedzo tsha tshiteṅwa tsha { $property } tsha { $element } (mutalo { $line }).
    }

help-kind-attribute = tshiteṅwa
help-kind-snippet = tshipiḓa
help-kind-array-entry = mbulungo kha mutevhe

help-default = Zwa kale:
help-active-default = Zwa kale zwi shumaho:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ndeme dzi tendelwaho (nthihi kha tshithu tshiṅwe na tshiṅwe):
       *[other] Ndeme dzi tendelwaho:
    }

help-suggested-values = Ndeme dzo themendelwaho:

help-inserts = I dzhenisa:

help-coordinates =
    { $count ->
        [one] Tshisumbavhuimo:
       *[other] Zwisumbavhuimo:
    }

help-type = Lushaka:

help-resolved-style = Sitaela tsho wanalaho (styleNumber { $styleNumber }):

help-resolved-function-names = Madzina a mishumo o wanalaho:
help-reset-list = Mutevhe wo vhuyedzedzwaho kha ndzheniso iyi:
help-added-on-input = Zwo engedzwaho kha ndzheniso iyi:
help-removed-on-input = Zwo bviswaho kha ndzheniso iyi:

help-reset-overrides = { $reset } i fhira { $additional } na { $removed }.
