# Italian editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reimposta
       *[update] Aggiorna
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } l’anteprima
       *[other] { $word } l’anteprima { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtra...
editor-variant-next = Seleziona la variante successiva
editor-variant-previous = Seleziona la variante precedente


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Rilevata una violazione di accessibilità WCAG AA. Clicca per { $action ->
            [close] chiudere
           *[open] aprire
        } il rapporto di accessibilità.
        [advisories] Clicca per { $action ->
            [close] chiudere
           *[open] aprire
        } il rapporto di accessibilità. Non sono state trovate violazioni WCAG AA, ma sono disponibili altri consigli sull’accessibilità.
       *[clean] Clicca per { $action ->
            [close] chiudere
           *[open] aprire
        } il rapporto di accessibilità. Non è stato trovato alcun problema di accessibilità.
    }

editor-accessibility-label =
    { $status ->
        [violations] Rilevata una violazione di accessibilità WCAG AA. Trovate { $count ->
            [one] { $count } violazione WCAG AA
           *[other] { $count } violazioni WCAG AA
        }. Clicca per { $action ->
            [close] chiudere
           *[open] aprire
        } il rapporto di accessibilità.
        [advisories] Nessuna violazione WCAG AA rilevata. Trovate { $count ->
            [one] { $count } ulteriore raccomandazione sull’accessibilità
           *[other] { $count } ulteriori raccomandazioni sull’accessibilità
        }. Clicca per { $action ->
            [close] chiudere
           *[open] aprire
        } il rapporto di accessibilità.
       *[clean] Nessuna violazione WCAG AA rilevata. Clicca per { $action ->
            [close] chiudere
           *[open] aprire
        } il rapporto di accessibilità.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versione { $version }

editor-tab-help = Aiuto contestuale
editor-tab-help-short = Contesto
editor-tab-errors = Errori
editor-tab-warnings = Avvisi
editor-tab-info = Info
editor-tab-accessibility = Accessibilità
editor-tab-responses = Risposte inviate

editor-tab-with-count = { $label }: { $count }

editor-options = Opzioni dell’editor
editor-format-as-doenetml = Formatta come DoenetML
editor-format-as-xml = Formatta come XML


## The diagnostics panel

editor-diagnostic-line = Riga n. { $line }

editor-no-errors = Nessun errore
editor-no-warnings = Nessun avviso
editor-no-info = Nessuna diagnostica informativa

editor-show-info-annotations = Mostra le diagnostiche informative nell’editor
editor-show-accessibility-annotations = Mostra le diagnostiche di accessibilità nell’editor

editor-accessibility-learn-more = Scopri come Doenet affronta l’accessibilità

editor-accessibility-violations-heading = Violazioni di accessibilità ({ $standard })

editor-accessibility-other-heading = Altri problemi di accessibilità
editor-none-found = Nessun risultato


## Submitted responses

editor-no-responses = Nessuna risposta inviata finora
editor-response-answer-id = Id della risposta
editor-response-response = Risposta
editor-response-credit = Credito
editor-response-submitted = Inviata


## The context-help panel

help-placeholder = Posiziona il cursore su un nome di tag, un attributo o { $ref } per vedere la documentazione.

help-unsupported-ref-chain = L’aiuto per i riferimenti in più parti come { $example } non è ancora disponibile.

help-unresolved-ref =
    { $reason ->
        [notFound] Nessun referente trovato per il riferimento: { $ref }.
        [multiple] Trovati più referenti per il riferimento: { $ref }.
       *[indeterminate] Non è stato possibile determinare un referente per { $ref }.
    }

help-learn-about-references = Scopri di più sui riferimenti →
help-reference-page = Pagina di riferimento →

help-suggestions-header =
    { $location ->
        [inside] All’interno di { $element }
       *[top] Al livello principale
    }{ $allowed ->
        [none] { " — qui non va nulla." }
        [text] { " — digita del testo qui." }
        [text-and-components] { " — digita del testo qui, oppure prova:" }
       *[components] { " — da provare:" }
    }

help-suggestions-footer = Premi { $shortcut } per vedere tutti i { $total } componenti.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } è un riferimento a { $target }.
       *[other] { $ref } è un riferimento a { $target } (riga { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introdotto da { $owner } come { $role }.
       *[other] Introdotto da { $owner } alla riga { $line } come { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } è un riferimento alla proprietà { $property } di { $element }.
       *[other] { $ref } è un riferimento alla proprietà { $property } di { $element } (riga { $line }).
    }

help-kind-attribute = attributo
help-kind-snippet = frammento
help-kind-array-entry = voce dell’array

help-default = Valore predefinito:
help-active-default = Valore predefinito attivo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valori ammessi (uno per elemento):
       *[other] Valori ammessi:
    }

help-suggested-values = Valori suggeriti:

help-inserts = Inserisce:

help-coordinates =
    { $count ->
        [one] Coordinata:
       *[other] Coordinate:
    }

help-type = Tipo:

help-resolved-style = Stile risolto (styleNumber { $styleNumber }):

help-resolved-function-names = Nomi di funzione risolti:
help-reset-list = Elenco di reimpostazione su questo campo:
help-added-on-input = Aggiunto su questo campo:
help-removed-on-input = Rimosso su questo campo:

help-reset-overrides = { $reset } prevale su { $additional } e { $removed }.
