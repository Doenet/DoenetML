# Emilian (emiliàn) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **`egl` is the Emilian half** of what `eml` lumps together with Romagnol,
# and the variety is **Bolognese** in the Vitali/Lepri orthography; see
# `chrome.ftl`.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Counts.** CLDR has **no** plural rules for `egl`, so no `zero`, `two`,
# `few` or `many` branch appears here or in any other file of this locale.
# `[one]`/`*[other]` is kept because that is the split the runtime fallback
# makes and the split Bolognese needs: the feminine plural is a real ending
# («coordinèta» → «coordinèt») and the verb agrees even where a masculine noun
# does not. Every symbolic selector — `$action`, `$status`, `$shortcut`,
# `$reason`, `$location`, `$allowed`, `$line`, `$perItem` — is kept byte for
# byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Tåurna indrî
       *[update] Aggiåurna
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } al viṡualiżadåur
       *[other] { $word } al viṡualiżadåur { $shortcut }
    }


## The variant picker

editor-variant = Variànt
editor-variant-filter = Félltra…
editor-variant-next = Ṡcâmpa al variànt pròsim
editor-variant-previous = Ṡcâmpa al variànt precedänt


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] As é truvè na violaziån d'acesibilitè WCAG AA. Prêm par { $action ->
            [close] serrèr
           *[open] avrîr
        } al rapôrt d'acesibilitè.
        [advisories] Prêm par { $action ->
            [close] serrèr
           *[open] avrîr
        } al rapôrt d'acesibilitè. An s é truvè inciónna violaziån WCAG AA, mo ai é di èter cunsélli d'acesibilitè.
       *[clean] Prêm par { $action ->
            [close] serrèr
           *[open] avrîr
        } al rapôrt d'acesibilitè. An s é truvè inción problêma d'acesibilitè.
    }

editor-accessibility-label =
    { $status ->
        [violations] As é truvè na violaziån d'acesibilitè WCAG AA. As é truvè { $count ->
            [one] { $count } violaziån WCAG AA
           *[other] { $count } violaziån WCAG AA
        }. Prêm par { $action ->
            [close] serrèr
           *[open] avrîr
        } al rapôrt d'acesibilitè.
        [advisories] An s é truvè inciónna violaziån WCAG AA. As é truvè { $count ->
            [one] { $count } cunsélli d'acesibilitè in pió
           *[other] { $count } cunsélli d'acesibilitè in pió
        }. Prêm par { $action ->
            [close] serrèr
           *[open] avrîr
        } al rapôrt d'acesibilitè.
       *[clean] An s é truvè inciónna violaziån WCAG AA. Prêm par { $action ->
            [close] serrèr
           *[open] avrîr
        } al rapôrt d'acesibilitè.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versiån ed DoenetML { $version }

editor-tab-help = Ajût pr al cuntèst
editor-tab-help-short = Cuntèst
editor-tab-errors = Erôr
editor-tab-warnings = Avîṡ
editor-tab-info = Informaziån
editor-tab-accessibility = Acesibilitè
editor-tab-responses = Rispòst mandè

editor-tab-with-count = { $label }: { $count }

editor-options = Opziån dl editåur
editor-format-as-doenetml = Fât cme DoenetML
editor-format-as-xml = Fât cme XML


## The diagnostics panel

editor-diagnostic-line = Rîga #{ $line }

editor-no-errors = Inción erôr
editor-no-warnings = Inción avîṡ
editor-no-info = Inciónna informaziån

editor-show-info-annotations = Mòstra äl informaziån int l'editåur
editor-show-accessibility-annotations = Mòstra i avîṡ d'acesibilitè int l'editåur

editor-accessibility-learn-more = Inpèra cme ch'al ciapa só l'acesibilitè Doenet

editor-accessibility-violations-heading = Violaziån d'acesibilitè ({ $standard })

editor-accessibility-other-heading = Èter problêmi d'acesibilitè
editor-none-found = Inción truvè


## Submitted responses

editor-no-responses = Ancåura inciónna rispòsta mandèda
editor-response-answer-id = Id dla rispòsta
editor-response-response = Rispòsta
editor-response-credit = Pónt
editor-response-submitted = Mandèda


## The context-help panel

help-placeholder = Mèt al curṡåur só un nómm ed tag, só un atribût o só { $ref } pr la documentaziån.

help-unsupported-ref-chain = L ajût pr i riferimént a pió tòc cme { $example } an n é ancåura brîṡa disponébil.

help-unresolved-ref =
    { $reason ->
        [notFound] Inción referänt truvè pr al riferimänt: { $ref }.
        [multiple] Pió referént truvè pr al riferimänt: { $ref }.
       *[indeterminate] An s é brîṡa psó determinèr un referänt par { $ref }.
    }

help-learn-about-references = Inpèra só i riferimént →
help-reference-page = Pàgina ed riferimänt →

help-suggestions-header =
    { $location ->
        [inside] Dänter in { $element }
       *[top] Al livèl pió èlt
    }{ $allowed ->
        [none] { " — qué an i và gnínta." }
        [text] { " — scrív tèst qué." }
        [text-and-components] { " — scrív tèst qué, o prôva:" }
       *[components] { " — quî da pruvèr:" }
    }

help-suggestions-footer = Prêm { $shortcut } par vàdder tótt i { $total } cumponént.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } l é un riferimänt a { $target }.
       *[other] { $ref } l é un riferimänt a { $target } (rîga { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introdótt da { $owner } cme { $role }.
       *[other] Introdótt da { $owner } int la rîga { $line } cme { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } l é un riferimänt ala proprietè { $property } ed { $element }.
       *[other] { $ref } l é un riferimänt ala proprietè { $property } ed { $element } (rîga { $line }).
    }

help-kind-attribute = atribût
help-kind-snippet = tòc ed tèst
help-kind-array-entry = vûṡ ed array

help-default = Predefiné:
help-active-default = Predefiné atîv:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valûr permíss (ón par elemänt):
       *[other] Valûr permíss:
    }

help-suggested-values = Valûr cunsiè:

help-inserts = Al métt dänter:

help-coordinates =
    { $count ->
        [one] Coordinèta:
       *[other] Coordinèt:
    }

help-type = Tîp:

help-resolved-style = Stîl riṡôlt (styleNumber { $styleNumber }):

help-resolved-function-names = Nómm ed funziån riṡôlt:
help-reset-list = Lésta ed turnèr indrî só ste input:
help-added-on-input = Żuntè só ste input:
help-removed-on-input = Cavè só ste input:

help-reset-overrides = { $reset } al pâsa dnanz a { $additional } e { $removed }.
