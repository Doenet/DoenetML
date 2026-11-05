# Ladin (ladin) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and standard.** Latin script, Ladin Dolomitan (the SPELL standard);
# see `chrome.ftl` for the note on the spelling and on the valley varieties.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Counts.** CLDR has rules for `lld` declaring `one`, `many` and `other`.
# `many` is reached only by an exact whole multiple of a million, which no
# count in this file can be, so a `[one]`/`*[other]` branch here is selected
# by Ladin's own rules and no `[many]` branch appears. See `chrome.ftl`. Every symbolic selector — `$action`, `$status`,
# `$shortcut`, `$reason`, `$location`, `$allowed`, `$line`, `$perItem` — is
# kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reporté endò
       *[update] Ajourné
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } l visualisadour
       *[other] { $word } l visualisadour { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtra…
editor-variant-next = Chiri l variant prosim
editor-variant-previous = Chiri l variant precedënt


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] S'à ciatà na violazion dla azessibilité WCAG AA. Clica per { $action ->
            [close] stlù
           *[open] daurì
        } l rapport de azessibilité.
        [advisories] Clica per { $action ->
            [close] stlù
           *[open] daurì
        } l rapport de azessibilité. No s'à ciatà degunes violazions WCAG AA, ma l é d'autri conseis de azessibilité.
       *[clean] Clica per { $action ->
            [close] stlù
           *[open] daurì
        } l rapport de azessibilité. No s'à ciatà degun problem de azessibilité.
    }

editor-accessibility-label =
    { $status ->
        [violations] S'à ciatà na violazion dla azessibilité WCAG AA. S'à ciatà { $count ->
            [one] { $count } violazion WCAG AA
           *[other] { $count } violazions WCAG AA
        }. Clica per { $action ->
            [close] stlù
           *[open] daurì
        } l rapport de azessibilité.
        [advisories] No s'à ciatà degunes violazions WCAG AA. S'à ciatà { $count ->
            [one] { $count } consei de azessibilité en plu
           *[other] { $count } conseis de azessibilité en plu
        }. Clica per { $action ->
            [close] stlù
           *[open] daurì
        } l rapport de azessibilité.
       *[clean] No s'à ciatà degunes violazions WCAG AA. Clica per { $action ->
            [close] stlù
           *[open] daurì
        } l rapport de azessibilité.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Version de DoenetML { $version }

editor-tab-help = Aiut per l contest
editor-tab-help-short = Contest
editor-tab-errors = Fai
editor-tab-warnings = Avertimënc
editor-tab-info = Enformazions
editor-tab-accessibility = Azessibilité
editor-tab-responses = Respostes manedes

editor-tab-with-count = { $label }: { $count }

editor-options = Opzions dl editour
editor-format-as-doenetml = Formaté sciche DoenetML
editor-format-as-xml = Formaté sciche XML


## The diagnostics panel

editor-diagnostic-line = Linia #{ $line }

editor-no-errors = Degun fal
editor-no-warnings = Degun avertimënt
editor-no-info = Deguna enformazion

editor-show-info-annotations = Mostra les enformazions tl editour
editor-show-accessibility-annotations = Mostra i avisc de azessibilité tl editour

editor-accessibility-learn-more = Empara coche Doenet ciapa ite la azessibilité

editor-accessibility-violations-heading = Violazions dla azessibilité ({ $standard })

editor-accessibility-other-heading = Autri problems de azessibilité
editor-none-found = Degun ciatà


## Submitted responses

editor-no-responses = Ćiamò deguna resposta manada
editor-response-answer-id = Id dla resposta
editor-response-response = Resposta
editor-response-credit = Ponc
editor-response-submitted = Manada


## The context-help panel

help-placeholder = Met l cursour sun n inuem de tag, sun n atribut o sun { $ref } per la documentazion.

help-unsupported-ref-chain = L aiut per i referimënc a plu tòc coche { $example } no é ćiamò a desposizion.

help-unresolved-ref =
    { $reason ->
        [notFound] Degun referënt ciatà per l referimënt: { $ref }.
        [multiple] Plu referënc ciatés per l referimënt: { $ref }.
       *[indeterminate] No s'à nia podù determiné n referënt per { $ref }.
    }

help-learn-about-references = Empara sun i referimënc →
help-reference-page = Plata de referimënt →

help-suggestions-header =
    { $location ->
        [inside] Ite te { $element }
       *[top] Sun l livel plu aut
    }{ $allowed ->
        [none] { " — chiló no va nia." }
        [text] { " — scrì test chiló." }
        [text-and-components] { " — scrì test chiló, o proa:" }
       *[components] { " — cosses da proé:" }
    }

help-suggestions-footer = Prem { $shortcut } per udëi duc i { $total } componënc.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } é n referimënt a { $target }.
       *[other] { $ref } é n referimënt a { $target } (linia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Enjigné da { $owner } sciche { $role }.
       *[other] Enjigné da { $owner } te la linia { $line } sciche { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } é n referimënt a la proprieté { $property } de { $element }.
       *[other] { $ref } é n referimënt a la proprieté { $property } de { $element } (linia { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = toch de test
help-kind-array-entry = ousc de array

help-default = Predefinì:
help-active-default = Predefinì ativ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valours permetui (un per elemënt):
       *[other] Valours permetui:
    }

help-suggested-values = Valours conseés:

help-inserts = L enserësc:

help-coordinates =
    { $count ->
        [one] Coordinata:
       *[other] Coordinates:
    }

help-type = Sort:

help-resolved-style = Stil resolt (styleNumber { $styleNumber }):

help-resolved-function-names = Inuems de funzion resolc:
help-reset-list = Lista de reporté endò sun chest input:
help-added-on-input = Njuntà sun chest input:
help-removed-on-input = Tout demez sun chest input:

help-reset-overrides = { $reset } va sourapro a { $additional } y { $removed }.
