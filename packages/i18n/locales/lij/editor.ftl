# Ligurian (ligure) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The grafîa ofiçiâ; see `chrome.ftl`.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Number.** CLDR has plural rules for `lij`, so a `one`/`other` branch is
# selected by Ligurian's own rules. Every symbolic selector — `$action`,
# `$status`, `$shortcut`, `$reason`, `$location`, `$allowed`, `$line`,
# `$perItem` — is kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Riprìstina
       *[update] Agiorna
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } o vixualizatô
       *[other] { $word } o vixualizatô { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtra…
editor-variant-next = Çerni a variante pròscima
editor-variant-previous = Çerni a variante precedente


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] S'é trovòu 'na violaçión de acesciblitæ WCAG AA. Sciacca pe { $action ->
            [close] serrâ
           *[open] arvî
        } o rapòrto de acesciblitæ.
        [advisories] Sciacca pe { $action ->
            [close] serrâ
           *[open] arvî
        } o rapòrto de acesciblitæ. No s'é trovòu violaçioin WCAG AA, ma gh'é atri conseggi de acesciblitæ.
       *[clean] Sciacca pe { $action ->
            [close] serrâ
           *[open] arvî
        } o rapòrto de acesciblitæ. No s'é trovòu nisciun problema de acesciblitæ.
    }

editor-accessibility-label =
    { $status ->
        [violations] S'é trovòu 'na violaçión de acesciblitæ WCAG AA. S'é trovòu { $count ->
            [one] { $count } violaçión WCAG AA
           *[other] { $count } violaçioin WCAG AA
        }. Sciacca pe { $action ->
            [close] serrâ
           *[open] arvî
        } o rapòrto de acesciblitæ.
        [advisories] No s'é trovòu violaçioin WCAG AA. S'é trovòu { $count ->
            [one] { $count } conseggio de acesciblitæ in ciù
           *[other] { $count } conseggi de acesciblitæ in ciù
        }. Sciacca pe { $action ->
            [close] serrâ
           *[open] arvî
        } o rapòrto de acesciblitæ.
       *[clean] No s'é trovòu violaçioin WCAG AA. Sciacca pe { $action ->
            [close] serrâ
           *[open] arvî
        } o rapòrto de acesciblitæ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Verscion de DoenetML { $version }

editor-tab-help = Agiutto pe-o contèsto
editor-tab-help-short = Contèsto
editor-tab-errors = Erôi
editor-tab-warnings = Avvertimenti
editor-tab-info = Informaçioin
editor-tab-accessibility = Acesciblitæ
editor-tab-responses = Risposte mandæ

editor-tab-with-count = { $label }: { $count }

editor-options = Opçioin de l'editô
editor-format-as-doenetml = Formatta comme DoenetML
editor-format-as-xml = Formatta comme XML


## The diagnostics panel

editor-diagnostic-line = Riga #{ $line }

editor-no-errors = Nisciun erô
editor-no-warnings = Nisciun avvertimento
editor-no-info = Nisciuña informaçión

editor-show-info-annotations = Fanni vedde e informaçioin inte l'editô
editor-show-accessibility-annotations = Fanni vedde i avvizi de acesciblitæ inte l'editô

editor-accessibility-learn-more = Impara comme che Doenet o piggia l'acesciblitæ

editor-accessibility-violations-heading = Violaçioin de acesciblitæ ({ $standard })

editor-accessibility-other-heading = Atri problemi de acesciblitæ
editor-none-found = Nisciun trovòu


## Submitted responses

editor-no-responses = Ancón nisciuña risposta mandâ
editor-response-answer-id = Id da risposta
editor-response-response = Risposta
editor-response-credit = Ponti
editor-response-submitted = Mandâ


## The context-help panel

help-placeholder = Metti o cursô in sce 'n nomme de tag, in sce 'n attributo ò in sce { $ref } pe-a documentaçión.

help-unsupported-ref-chain = L'agiutto pe-i riferimenti a ciù tòcchi comme { $example } o no l'é ancón pronto.

help-unresolved-ref =
    { $reason ->
        [notFound] Nisciun referente trovòu pe-o riferimento: { $ref }.
        [multiple] Ciù referenti trovæ pe-o riferimento: { $ref }.
       *[indeterminate] No s'é riuscîo a determinâ 'n referente pe { $ref }.
    }

help-learn-about-references = Impara in sci riferimenti →
help-reference-page = Pagina de riferimento →

help-suggestions-header =
    { $location ->
        [inside] Drento de { $element }
       *[top] A-o livello ciù erto
    }{ $allowed ->
        [none] { " — chi no ghe va ninte." }
        [text] { " — scrivi do testo chi." }
        [text-and-components] { " — scrivi do testo chi, ò preuva:" }
       *[components] { " — cöse da provâ:" }
    }

help-suggestions-footer = Sciacca { $shortcut } pe vedde tutti i { $total } componenti.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } o l'é 'n riferimento a { $target }.
       *[other] { $ref } o l'é 'n riferimento a { $target } (riga { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introdûto da { $owner } comme { $role }.
       *[other] Introdûto da { $owner } inta riga { $line } comme { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } o l'é 'n riferimento a-a proprietæ { $property } de { $element }.
       *[other] { $ref } o l'é 'n riferimento a-a proprietæ { $property } de { $element } (riga { $line }).
    }

help-kind-attribute = attributo
help-kind-snippet = tòcco de testo
help-kind-array-entry = voxe de array

help-default = Predefinîo:
help-active-default = Predefinîo attivo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valoî permissi (un pe elemento):
       *[other] Valoî permissi:
    }

help-suggested-values = Valoî conseggiæ:

help-inserts = O inserisce:

help-coordinates =
    { $count ->
        [one] Coordinâta:
       *[other] Coordinæ:
    }

help-type = Tipo:

help-resolved-style = Stile rezòlto (styleNumber { $styleNumber }):

help-resolved-function-names = Nommi de fonçión rezòlti:
help-reset-list = Lista de riprìstino in sce sto input:
help-added-on-input = Azonto in sce sto input:
help-removed-on-input = Levòu da sto input:

help-reset-overrides = { $reset } o passa in sce { $additional } e { $removed }.
