# Neapolitan (napulitano) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography and metaphony.** See `chrome.ftl`.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Number.** CLDR has no plural rules for `nap`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere. Every symbolic selector — `$action`,
# `$status`, `$shortcut`, `$reason`, `$location`, `$allowed`, `$line`,
# `$perItem` — is kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Rimette a posto
       *[update] Aggiorna
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } 'o visualizzatore
       *[other] { $word } 'o visualizzatore { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtra…
editor-variant-next = Scegli 'a variante prossima
editor-variant-previous = Scegli 'a variante precedente


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] S'è truvata na vviulazione 'e accessibbilità WCAG AA. Schiaffa pe { $action ->
            [close] chiudere
           *[open] arapì
        } 'o rapporto 'e accessibbilità.
        [advisories] Schiaffa pe { $action ->
            [close] chiudere
           *[open] arapì
        } 'o rapporto 'e accessibbilità. Nun s'è truvata nisciuna vviulazione WCAG AA, ma nce stanno ate cunziglie 'e accessibbilità.
       *[clean] Schiaffa pe { $action ->
            [close] chiudere
           *[open] arapì
        } 'o rapporto 'e accessibbilità. Nun s'è truvato nisciuno prubblema 'e accessibbilità.
    }

editor-accessibility-label =
    { $status ->
        [violations] S'è truvata na vviulazione 'e accessibbilità WCAG AA. S'è truvato { $count ->
            [one] { $count } vviulazione WCAG AA
           *[other] { $count } vviulazione WCAG AA
        }. Schiaffa pe { $action ->
            [close] chiudere
           *[open] arapì
        } 'o rapporto 'e accessibbilità.
        [advisories] Nun s'è truvata nisciuna vviulazione WCAG AA. S'è truvato { $count ->
            [one] { $count } cunziglio 'e accessibbilità 'e cchiù
           *[other] { $count } cunziglie 'e accessibbilità 'e cchiù
        }. Schiaffa pe { $action ->
            [close] chiudere
           *[open] arapì
        } 'o rapporto 'e accessibbilità.
       *[clean] Nun s'è truvata nisciuna vviulazione WCAG AA. Schiaffa pe { $action ->
            [close] chiudere
           *[open] arapì
        } 'o rapporto 'e accessibbilità.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versione 'e DoenetML { $version }

editor-tab-help = Aiuto p''o cuntesto
editor-tab-help-short = Cuntesto
editor-tab-errors = Errore
editor-tab-warnings = Avvise
editor-tab-info = Nfurmazione
editor-tab-accessibility = Accessibbilità
editor-tab-responses = Risposte mannate

editor-tab-with-count = { $label }: { $count }

editor-options = Opzione 'e ll'editore
editor-format-as-doenetml = Furmatta comme DoenetML
editor-format-as-xml = Furmatta comme XML


## The diagnostics panel

editor-diagnostic-line = Riga #{ $line }

editor-no-errors = Nisciuno errore
editor-no-warnings = Nisciuno avviso
editor-no-info = Nisciuna nfurmazione

editor-show-info-annotations = Mmostra 'e nfurmazione dint'a ll'editore
editor-show-accessibility-annotations = Mmostra ll'avvise 'e accessibbilità dint'a ll'editore

editor-accessibility-learn-more = Mpara comme Doenet piglia ll'accessibbilità

editor-accessibility-violations-heading = Vviulazione 'e accessibbilità ({ $standard })

editor-accessibility-other-heading = Ate prubbleme 'e accessibbilità
editor-none-found = Nisciuno truvato


## Submitted responses

editor-no-responses = Ancora nisciuna risposta mannata
editor-response-answer-id = Id d''a risposta
editor-response-response = Risposta
editor-response-credit = Punte
editor-response-submitted = Mannata


## The context-help panel

help-placeholder = Miette 'o cursore ncopp'a nu nomme 'e tag, ncopp'a n'attributo o ncopp'a { $ref } p''a documentazione.

help-unsupported-ref-chain = ll'aiuto p''e riferimente a cchiù piezze comme { $example } nun è ancora pronto.

help-unresolved-ref =
    { $reason ->
        [notFound] Nisciuno referente truvato p''o riferimento: { $ref }.
        [multiple] Cchiù referente truvate p''o riferimento: { $ref }.
       *[indeterminate] Nun s'è arrivato a determinà nu referente pe { $ref }.
    }

help-learn-about-references = Mpara ncopp''e riferimente →
help-reference-page = Paggena 'e riferimento →

help-suggestions-header =
    { $location ->
        [inside] Dinto a { $element }
       *[top] 'O livello cchiù auto
    }{ $allowed ->
        [none] { " — ccà nun nce va niente." }
        [text] { " — scrive testo ccà." }
        [text-and-components] { " — scrive testo ccà, o prova:" }
       *[components] { " — cose 'a pruvà:" }
    }

help-suggestions-footer = Schiaffa { $shortcut } pe vedé tutte 'e { $total } cumpunente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } è nu riferimento a { $target }.
       *[other] { $ref } è nu riferimento a { $target } (riga { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Mmiso 'a { $owner } comme { $role }.
       *[other] Mmiso 'a { $owner } ncopp''a riga { $line } comme { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } è nu riferimento â pruprietà { $property } 'e { $element }.
       *[other] { $ref } è nu riferimento â pruprietà { $property } 'e { $element } (riga { $line }).
    }

help-kind-attribute = attributo
help-kind-snippet = piezzo 'e testo
help-kind-array-entry = voce 'e array

help-default = Predefinito:
help-active-default = Predefinito attivo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valure permesse (uno pe elemento):
       *[other] Valure permesse:
    }

help-suggested-values = Valure cunzigliate:

help-inserts = Nzerta:

help-coordinates =
    { $count ->
        [one] Cuurdenata:
       *[other] Cuurdenate:
    }

help-type = Tipo:

help-resolved-style = Stile risolto (styleNumber { $styleNumber }):

help-resolved-function-names = Nomme 'e funzione risolte:
help-reset-list = Lista 'e rimessa a posto ncopp'a stu input:
help-added-on-input = Aggiunto ncopp'a stu input:
help-removed-on-input = Levato 'a stu input:

help-reset-overrides = { $reset } passa ncoppa a { $additional } e { $removed }.
