# Corsican editor and language-server surfaces. Translated from
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
        [reset] Reinizializà
       *[update] Aghjurnà
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } u visualizatore
       *[other] { $word } u visualizatore { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtru…
editor-variant-next = Sceglie a variante seguente
editor-variant-previous = Sceglie a variante precedente


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Hè stata identificata una viulazione di l'accessibilità secondu WCAG AA. Clicca per { $action ->
            [close] chjude
           *[open] apre
        } u rapportu d'accessibilità.
        [advisories] Clicca per { $action ->
            [close] chjude
           *[open] apre
        } u rapportu d'accessibilità. Ùn hè stata trova nisuna viulazione WCAG AA, ma ci sò altre raccomandazioni d'accessibilità.
       *[clean] Clicca per { $action ->
            [close] chjude
           *[open] apre
        } u rapportu d'accessibilità. Ùn hè statu trovu nisunu prublema d'accessibilità.
    }

editor-accessibility-label =
    { $status ->
        [violations] Hè stata identificata una viulazione di l'accessibilità secondu WCAG AA. { $count ->
            [one] Hè stata trova { $count } viulazione WCAG AA
           *[other] Sò state trove { $count } viulazioni WCAG AA
        }. Clicca per { $action ->
            [close] chjude
           *[open] apre
        } u rapportu d'accessibilità.
        [advisories] Ùn hè stata identificata nisuna viulazione WCAG AA. { $count ->
            [one] Hè stata trova { $count } raccomandazione d'accessibilità in più
           *[other] Sò state trove { $count } raccomandazioni d'accessibilità in più
        }. Clicca per { $action ->
            [close] chjude
           *[open] apre
        } u rapportu d'accessibilità.
       *[clean] Ùn hè stata identificata nisuna viulazione WCAG AA. Clicca per { $action ->
            [close] chjude
           *[open] apre
        } u rapportu d'accessibilità.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versione { $version } di DoenetML

editor-tab-help = Aiutu secondu u cuntestu
editor-tab-help-short = Cuntestu
editor-tab-errors = Errori
editor-tab-warnings = Avvertimenti
editor-tab-info = Infurmazione
editor-tab-accessibility = Accessibilità
editor-tab-responses = Risposte mandate

editor-tab-with-count = { $label }: { $count }

editor-options = Opzioni di l'editore
editor-format-as-doenetml = Furmattà cum'è DoenetML
editor-format-as-xml = Furmattà cum'è XML


## The diagnostics panel

editor-diagnostic-line = Linea n. { $line }

editor-no-errors = Nisunu errore
editor-no-warnings = Nisunu avvertimentu
editor-no-info = Nisunu messagiu infurmativu

editor-show-info-annotations = Mustrà i messagi infurmativi in l'editore
editor-show-accessibility-annotations = Mustrà i messagi d'accessibilità in l'editore

editor-accessibility-learn-more = Cumu Doenet affronta l'accessibilità

editor-accessibility-violations-heading = Viulazioni d'accessibilità ({ $standard })

editor-accessibility-other-heading = Altri prublemi d'accessibilità
editor-none-found = Ùn hè statu trovu nunda


## Submitted responses

editor-no-responses = Ancu nisuna risposta mandata
editor-response-answer-id = Id di a risposta
editor-response-response = Risposta
editor-response-credit = Punti
editor-response-submitted = Mandata


## The context-help panel

help-placeholder = Metti u cursore nantu à un nome d'etichetta, un attributu o { $ref } per a ducumentazione.

help-unsupported-ref-chain = L'aiutu per e riferenze di parechje parti cum'è { $example } ùn hè ancu supportatu.

help-unresolved-ref =
    { $reason ->
        [notFound] Ùn hè statu trovu nisunu riferente per a riferenza: { $ref }.
        [multiple] Sò stati trovi parechji riferenti per a riferenza: { $ref }.
       *[indeterminate] Ùn s'hè pussutu determinà un riferente per { $ref }.
    }

help-learn-about-references = Sapene di più nantu à e riferenze →
help-reference-page = Pagina di riferenza →

help-suggestions-header =
    { $location ->
        [inside] Dentru { $element }
       *[top] À u livellu più altu
    }{ $allowed ->
        [none] { " — quì ùn ci và nunda." }
        [text] { " — scrivi testu quì." }
        [text-and-components] { " — scrivi testu quì, o prova:" }
       *[components] { " — prova:" }
    }

help-suggestions-footer = Pressa { $shortcut } per vede tutti i { $total } cumpunenti.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } hè una riferenza à { $target }.
       *[other] { $ref } hè una riferenza à { $target } (linea { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introdutta da { $owner } cum'è { $role }.
       *[other] Introdutta da { $owner } à a linea { $line } cum'è { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } hè una riferenza à a pruprietà { $property } di { $element }.
       *[other] { $ref } hè una riferenza à a pruprietà { $property } di { $element } (linea { $line }).
    }

help-kind-attribute = attributu
help-kind-snippet = frammentu
help-kind-array-entry = elementu di tabella

help-default = Valore predefinitu:
help-active-default = Valore predefinitu attivu:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valori permessi (unu per elementu):
       *[other] Valori permessi:
    }

help-suggested-values = Valori suggeriti:

help-inserts = Insirisce:

help-coordinates =
    { $count ->
        [one] Coordinata:
       *[other] Coordinate:
    }

help-type = Tipu:

help-resolved-style = Stile risoltu (styleNumber { $styleNumber }):

help-resolved-function-names = Nomi di funzione risolti:
help-reset-list = Lista di reinizializazione nantu à stu campu:
help-added-on-input = Aghjuntu nantu à stu campu:
help-removed-on-input = Toltu nantu à stu campu:

help-reset-overrides = { $reset } passa nanzu à { $additional } è { $removed }.
