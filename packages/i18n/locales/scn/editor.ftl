# Sicilian editor and language-server surfaces. Translated from
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
#
# Sicilian's third plural category is unreachable here; see `chrome.ftl`'s
# header. In the two counted phrases in `editor-accessibility-label`,
# «viulazzioni» and «raccumannazzioni» are the same word in the singular and
# the plural, so the branches differ only in the passive verb in front of them
# — «fu truvata» against «foru truvati» — which is what the select is carrying.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Rimposta
       *[update] Agghiorna
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } u visualizzaturi
       *[other] { $word } u visualizzaturi { $shortcut }
    }


## The variant picker

editor-variant = Varianti
editor-variant-filter = Filtru…
editor-variant-next = Scegghi a varianti successiva
editor-variant-previous = Scegghi a varianti precedenti


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Fu truvata na viulazzioni di l'accissibbilità secunnu WCAG AA. Clicca pi { $action ->
            [close] chiuiri
           *[open] grapiri
        } u rapportu d'accissibbilità.
        [advisories] Clicca pi { $action ->
            [close] chiuiri
           *[open] grapiri
        } u rapportu d'accissibbilità. Nun fu truvata nudda viulazzioni WCAG AA, ma ci sunnu àutri raccumannazzioni d'accissibbilità.
       *[clean] Clicca pi { $action ->
            [close] chiuiri
           *[open] grapiri
        } u rapportu d'accissibbilità. Nun fu truvatu nuddu prubblema d'accissibbilità.
    }

editor-accessibility-label =
    { $status ->
        [violations] Fu truvata na viulazzioni di l'accissibbilità secunnu WCAG AA. { $count ->
            [one] Fu truvata { $count } viulazzioni WCAG AA
           *[other] Foru truvati { $count } viulazzioni WCAG AA
        }. Clicca pi { $action ->
            [close] chiuiri
           *[open] grapiri
        } u rapportu d'accissibbilità.
        [advisories] Nun fu truvata nudda viulazzioni WCAG AA. { $count ->
            [one] Fu truvata { $count } raccumannazzioni d'accissibbilità n chiù
           *[other] Foru truvati { $count } raccumannazzioni d'accissibbilità n chiù
        }. Clicca pi { $action ->
            [close] chiuiri
           *[open] grapiri
        } u rapportu d'accissibbilità.
       *[clean] Nun fu truvata nudda viulazzioni WCAG AA. Clicca pi { $action ->
            [close] chiuiri
           *[open] grapiri
        } u rapportu d'accissibbilità.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Virsioni { $version } di DoenetML

editor-tab-help = Aiutu secunnu u cuntestu
editor-tab-help-short = Cuntestu
editor-tab-errors = Erruri
editor-tab-warnings = Avvisi
editor-tab-info = Nfurmazzioni
editor-tab-accessibility = Accissibbilità
editor-tab-responses = Risposti mannati

editor-tab-with-count = { $label }: { $count }

editor-options = Opzioni di l'edituri
editor-format-as-doenetml = Formatta comu DoenetML
editor-format-as-xml = Formatta comu XML


## The diagnostics panel

editor-diagnostic-line = Riga n. { $line }

editor-no-errors = Nuddu erruri
editor-no-warnings = Nuddu avvisu
editor-no-info = Nuddu missaggiu nfurmativu

editor-show-info-annotations = Ammustra i missaggi nfurmativi nta l'edituri
editor-show-accessibility-annotations = Ammustra i missaggi d'accissibbilità nta l'edituri

editor-accessibility-learn-more = Comu Doenet affronta l'accissibbilità

editor-accessibility-violations-heading = Viulazzioni d'accissibbilità ({ $standard })

editor-accessibility-other-heading = Àutri prubblemi d'accissibbilità
editor-none-found = Nun fu truvatu nenti


## Submitted responses

editor-no-responses = Ancora nudda risposta mannata
editor-response-answer-id = Id dâ risposta
editor-response-response = Risposta
editor-response-credit = Punti
editor-response-submitted = Mannata


## The context-help panel

help-placeholder = Metti u cursuri supra un nomu d'etichetta, un attribbutu o { $ref } pâ ducumintazzioni.

help-unsupported-ref-chain = L'aiutu pi rifirimenti di chiù parti comu { $example } ancora nun è suppurtatu.

help-unresolved-ref =
    { $reason ->
        [notFound] Nun fu truvatu nuddu rifirenti pû rifirimentu: { $ref }.
        [multiple] Foru truvati chiù rifirenti pû rifirimentu: { $ref }.
       *[indeterminate] Nun si potti determinari un rifirenti pi { $ref }.
    }

help-learn-about-references = Sapìri di chiù supra i rifirimenti →
help-reference-page = Pàggina di rifirimentu →

help-suggestions-header =
    { $location ->
        [inside] Dintra { $element }
       *[top] Ô livellu chiù autu
    }{ $allowed ->
        [none] { " — ccà nun ci va nenti." }
        [text] { " — scrivi testu ccà." }
        [text-and-components] { " — scrivi testu ccà, o prova:" }
       *[components] { " — prova:" }
    }

help-suggestions-footer = Ammacca { $shortcut } pi vidiri tutti i { $total } cumpunenti.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } è un rifirimentu a { $target }.
       *[other] { $ref } è un rifirimentu a { $target } (riga { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ntruduciutu di { $owner } comu { $role }.
       *[other] Ntruduciutu di { $owner } ntâ riga { $line } comu { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } è un rifirimentu â prupietà { $property } di { $element }.
       *[other] { $ref } è un rifirimentu â prupietà { $property } di { $element } (riga { $line }).
    }

help-kind-attribute = attribbutu
help-kind-snippet = frammentu
help-kind-array-entry = elementu di matrici

help-default = Valuri pridifinutu:
help-active-default = Valuri pridifinutu attivu:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valuri permittuti (unu pi elementu):
       *[other] Valuri permittuti:
    }

help-suggested-values = Valuri suggirruti:

help-inserts = Nzerta:

help-coordinates =
    { $count ->
        [one] Cuurdinata:
       *[other] Cuurdinati:
    }

help-type = Tipu:

help-resolved-style = Stili risurvutu (styleNumber { $styleNumber }):

help-resolved-function-names = Nomi di funzioni risurvuti:
help-reset-list = Lista di rimpustazzioni nta stu campu:
help-added-on-input = Junciutu nta stu campu:
help-removed-on-input = Livatu nta stu campu:

help-reset-overrides = { $reset } passa nnanzi a { $additional } e { $removed }.
