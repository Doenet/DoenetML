# Kikuyu editor and language-server surfaces: the footer, the diagnostics
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
        [reset] Cookia
       *[update] Erũhia
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Mũonania
       *[other] { $word } Mũonania { $shortcut }
    }


## The variant picker

editor-variant = Mũthemba

editor-variant-filter = Thuura…

editor-variant-next = Thuura mũthemba ũrĩa ũrũmĩrĩire

editor-variant-previous = Thuura mũthemba ũrĩa ũhĩtũkĩte


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Nĩ kwoneka kũagarara WCAG AA kwa ũkinyĩrĩri. Ringa nĩguo { $action ->
            [close] ũhinge
           *[open] ũhingũre
        } ripoti ya ũkinyĩrĩri.
        [advisories] Ringa nĩguo { $action ->
            [close] ũhinge
           *[open] ũhingũre
        } ripoti ya ũkinyĩrĩri. Gũtirĩ kũagarara WCAG AA kũrĩa kuoneka, no nĩ kũrĩ mataaro mangĩ ma ũkinyĩrĩri.
       *[clean] Ringa nĩguo { $action ->
            [close] ũhinge
           *[open] ũhingũre
        } ripoti ya ũkinyĩrĩri. Gũtirĩ mathĩna ma ũkinyĩrĩri marĩa moneka.
    }

editor-accessibility-label =
    { $status ->
        [violations] Nĩ kwoneka kũagarara WCAG AA kwa ũkinyĩrĩri. Nĩ kwoneka { $count ->
            [one] kũagarara WCAG AA { $count }
           *[other] kũagarara WCAG AA { $count }
        }. Ringa nĩguo { $action ->
            [close] ũhinge
           *[open] ũhingũre
        } ripoti ya ũkinyĩrĩri.
        [advisories] Gũtirĩ kũagarara WCAG AA kũrĩa kuoneka. Nĩ kwoneka { $count ->
            [one] itaaro rĩngĩ rĩa ũkinyĩrĩri { $count }
           *[other] mataaro mangĩ ma ũkinyĩrĩri { $count }
        }. Ringa nĩguo { $action ->
            [close] ũhinge
           *[open] ũhingũre
        } ripoti ya ũkinyĩrĩri.
       *[clean] Gũtirĩ kũagarara WCAG AA kũrĩa kuoneka. Ringa nĩguo { $action ->
            [close] ũhinge
           *[open] ũhingũre
        } ripoti ya ũkinyĩrĩri.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Mũthemba wa DoenetML { $version }

editor-tab-help = Ũteithio wa handũ
editor-tab-help-short = Handũ
editor-tab-errors = Mahĩtia
editor-tab-warnings = Mĩkaana
editor-tab-info = Ũhoro
editor-tab-accessibility = Ũkinyĩrĩri
editor-tab-responses = Macookio marĩa matũmĩtwo

editor-tab-with-count = { $label }: { $count }

editor-options = Ũthuuri wa mũthondeki
editor-format-as-doenetml = Thondeka ta DoenetML
editor-format-as-xml = Thondeka ta XML


## The diagnostics panel

editor-diagnostic-line = Mũhari #{ $line }

editor-no-errors = Gũtirĩ Mahĩtia
editor-no-warnings = Gũtirĩ Mĩkaana
editor-no-info = Gũtirĩ Ũhoro

editor-show-info-annotations = Onania ũhoro thĩinĩ wa mũthondeki
editor-show-accessibility-annotations = Onania mĩkaana ya ũkinyĩrĩri thĩinĩ wa mũthondeki

editor-accessibility-learn-more = Wĩrute ũrĩa Doenet ĩonaga ũkinyĩrĩri

editor-accessibility-violations-heading = Kũagarara kwa ũkinyĩrĩri ({ $standard })

editor-accessibility-other-heading = Mathĩna mangĩ ma ũkinyĩrĩri
editor-none-found = Gũtirĩ kĩrĩa kĩoneka


## Submitted responses

editor-no-responses = Gũtirĩ macookio matũmĩtwo nginya rĩu
editor-response-answer-id = Aidi ya Macookio
editor-response-response = Macookio
editor-response-credit = Mabatho
editor-response-submitted = Nĩmatũmĩtwo


## The context-help panel

help-placeholder = Iga kesa rĩĩtwa-inĩ rĩa tagi, kĩgeranio-inĩ, kana harĩ { $ref } nĩguo wone maandĩko.

help-unsupported-ref-chain = Ũteithio wa marũgamĩrĩri ma icunjĩ nyingĩ ta { $example } ndũrĩ mũteithĩrie o na rĩu.

help-unresolved-ref =
    { $reason ->
        [notFound] Gũtirĩ kĩrĩa kĩoneka harĩ rũgamĩrĩri rũrũ: { $ref }.
        [multiple] Nĩ kwoneka indo nyingĩ harĩ rũgamĩrĩri rũrũ: { $ref }.
       *[indeterminate] Kĩrĩa { $ref } ĩrũgamĩrĩire gĩtingĩmenyeka.
    }

help-learn-about-references = Wĩrute ũhoro wa marũgamĩrĩri →
help-reference-page = Karatathi ka rũgamĩrĩri →

help-suggestions-header =
    { $location ->
        [inside] Thĩinĩ wa { $element }
       *[top] Igũrũ mũno
    }{ $allowed ->
        [none] { " — gũtirĩ kĩndũ gĩgũthiĩ haha." }
        [text] { " — andĩka maandĩko haha." }
        [text-and-components] { " — andĩka maandĩko haha, kana ũgerie:" }
       *[components] { " — indo iria ũngĩgeria:" }
    }

help-suggestions-footer = Ringa { $shortcut } nĩguo wone icunjĩ ciothe { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } nĩ rũgamĩrĩri rwa { $target }.
       *[other] { $ref } nĩ rũgamĩrĩri rwa { $target } (mũhari { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Nĩ yarehirwo nĩ { $owner } ta { $role }.
       *[other] Nĩ yarehirwo nĩ { $owner } mũhari-inĩ wa { $line } ta { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } nĩ rũgamĩrĩri rwa kĩgeranio kĩa { $property } kĩa { $element }.
       *[other] { $ref } nĩ rũgamĩrĩri rwa kĩgeranio kĩa { $property } kĩa { $element } (mũhari { $line }).
    }

help-kind-attribute = kĩgeranio
help-kind-snippet = gĩcunjĩ
help-kind-array-entry = kwĩyandĩkithia mũtaratara-inĩ

help-default = Kĩa mũtugo:
help-active-default = Kĩa mũtugo kĩrĩa kĩraruta wĩra:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mĩigana ĩrĩa ĩtĩkĩrĩtio (ũmwe harĩ kĩndũ o gĩothe):
       *[other] Mĩigana ĩrĩa ĩtĩkĩrĩtio:
    }

help-suggested-values = Mĩigana ĩrĩa ĩtaarĩirio:

help-inserts = Ĩtoonyagia:

help-coordinates =
    { $count ->
        [one] Kĩonereria kĩa handũ:
       *[other] Ionereria cia handũ:
    }

help-type = Mũthemba:

help-resolved-style = Mũthiĩre ũrĩa wonekete (styleNumber { $styleNumber }):

help-resolved-function-names = Marĩĩtwa ma wĩra marĩa monekete:
help-reset-list = Mũtaratara ũrĩa ũcoketio harĩ ũtoonyia ũyũ:
help-added-on-input = Kĩrĩa kĩongereirwo harĩ ũtoonyia ũyũ:
help-removed-on-input = Kĩrĩa kĩeheririo harĩ ũtoonyia ũyũ:

help-reset-overrides = { $reset } nĩĩkĩrĩte { $additional } na { $removed }.
