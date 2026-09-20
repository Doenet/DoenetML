# Extremaduran (estremeñu) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`. `locales/en/editor.ftl` is the
# source of truth and message ids are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script in the OSCEC standard: final -o → -u
# and -e → -i, infinitives in -l, participles -áu / -á, «i» for *and*, the
# clitic «si». See `chrome.ftl` for the whole note. Latin digits throughout.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **What is Extremaduran here.** «no si pue», «tieni», «alcontráu», «esti»,
# «porqui», «i» for *and*, «pincha» and the infinitives «amostral», «abril»,
# «cerral», «formateal». The editor's technical vocabulary — «atributu»,
# «componenti», «varianti», «referencia», «diagnósticu» — is the learned
# Romance layer that reaches Extremaduran through **Spanish**, and is borrowed
# without disguise.
#
# **Counts.** CLDR has **no plural data for `ext`**, so no `[one]`, `[zero]`,
# `[two]`, `[few]` or `[many]` branch appears anywhere. Where English selects
# on a count — the WCAG violation count in `editor-accessibility-label`, and
# `help-coordinates` — one form is written that reads for any number. In
# `help-coordinates` that form is the plural «Coordenás:», which is the label
# an editor pane wants in any case.
#
# **Weakest first.** «formateal» for *format* and «pincha» for *click* are
# guesses, as is the whole register of a text editor: Extremaduran has no
# established software usage to check them against.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reinicial
       *[update] Autualizal
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } el visol
       *[other] { $word } el visol { $shortcut }
    }


## The variant picker

editor-variant = Varianti
editor-variant-filter = Hiltral…
editor-variant-next = Escogel la varianti siguienti
editor-variant-previous = Escogel la varianti anteriol


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] S'alcontró una vurneracion d'accessibiliá WCAG AA. Pincha pa { $action ->
            [close] cerral
           *[open] abril
        } el informi d'accessibiliá.
        [advisories] Pincha pa { $action ->
            [close] cerral
           *[open] abril
        } el informi d'accessibiliá. No s'alcontró denguna vurneracion WCAG AA, pero ai otras recomendacionis d'accessibiliá.
       *[clean] Pincha pa { $action ->
            [close] cerral
           *[open] abril
        } el informi d'accessibiliá. No s'alcontró dengún prubrema d'accessibiliá.
    }

editor-accessibility-label =
    { $status ->
        [violations] S'alcontró una vurneracion d'accessibiliá WCAG AA. S'alcontrarun { $count } vurneracionis WCAG AA. Pincha pa { $action ->
            [close] cerral
           *[open] abril
        } el informi d'accessibiliá.
        [advisories] No s'alcontró denguna vurneracion WCAG AA. S'alcontrarun { $count } recomendacionis d'accessibiliá mas. Pincha pa { $action ->
            [close] cerral
           *[open] abril
        } el informi d'accessibiliá.
       *[clean] No s'alcontró denguna vurneracion WCAG AA. Pincha pa { $action ->
            [close] cerral
           *[open] abril
        } el informi d'accessibiliá.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Version de DoenetML { $version }

editor-tab-help = Ayua sigún el contestu
editor-tab-help-short = Contestu
editor-tab-errors = Errus
editor-tab-warnings = Avisus
editor-tab-info = Informacion
editor-tab-accessibility = Accessibiliá
editor-tab-responses = Respuestas mandás

editor-tab-with-count = { $label }: { $count }

editor-options = Opcionis del editol
editor-format-as-doenetml = Formateal comu DoenetML
editor-format-as-xml = Formateal comu XML


## The diagnostics panel

editor-diagnostic-line = Linia #{ $line }

editor-no-errors = Dengún erru
editor-no-warnings = Dengún avisu
editor-no-info = Dengún diagnósticu d'informacion

editor-show-info-annotations = Amostral los diagnósticus d'informacion nel editol
editor-show-accessibility-annotations = Amostral los diagnósticus d'accessibiliá nel editol

editor-accessibility-learn-more = Aprendi comu Doenet encara l'accessibiliá

editor-accessibility-violations-heading = Vurneracionis d'accessibiliá ({ $standard })

editor-accessibility-other-heading = Otrus prubremas d'accessibiliá
editor-none-found = No s'alcontró dengunu

## Submitted responses

editor-no-responses = Endavia no ai denguna respuesta mandá
editor-response-answer-id = Id de la respuesta
editor-response-response = Respuesta
editor-response-credit = Puntus
editor-response-submitted = Mandá


## The context-help panel

help-placeholder = Poni el cursol sobri un nombri d'etiqueta, un atributu o { $ref } pa la documentacion.

help-unsupported-ref-chain = L'ayua pa las referencias de muchas partis comu { $example } endavia no está lista.

help-unresolved-ref =
    { $reason ->
        [notFound] No s'alcontró dengún referenti pa la referencia: { $ref }.
        [multiple] S'alcontrarun muchus referentis pa la referencia: { $ref }.
       *[indeterminate] No si puó determinal un referenti pa { $ref }.
    }

help-learn-about-references = Aprendi sobri las referencias →
help-reference-page = Páhina de referencia →

help-suggestions-header =
    { $location ->
        [inside] Endrentu de { $element }
       *[top] Nel nivel de mas arriba
    }{ $allowed ->
        [none] { " — aquí no va na." }
        [text] { " — escrivi testu aquí." }
        [text-and-components] { " — escrivi testu aquí, o prueva:" }
       *[components] { " — cosas pa prubal:" }
    }

help-suggestions-footer = Aprieta { $shortcut } pa vel los { $total } componentis.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } es una referencia a { $target }.
       *[other] { $ref } es una referencia a { $target } (linia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Metíu por { $owner } comu { $role }.
       *[other] Metíu por { $owner } en la linia { $line } comu { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } es una referencia a la propieá { $property } de { $element }.
       *[other] { $ref } es una referencia a la propieá { $property } de { $element } (linia { $line }).
    }

help-kind-attribute = atributu
help-kind-snippet = fragmentu
help-kind-array-entry = entrá de vector

help-default = Por defeutu:
help-active-default = Por defeutu activu:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valoris premitíus (unu por elementu):
       *[other] Valoris premitíus:
    }

help-suggested-values = Valoris suheríus:

help-inserts = Meti:

# CLDR has no plural data for `ext`, so no `[one]` branch is written: the
# plural form is the one an editor pane wants for a list of coordinates in any
# case.
help-coordinates = Coordenás:

help-type = Tipu:

help-resolved-style = Estilu resuertu (styleNumber { $styleNumber }):

help-resolved-function-names = Nombris de funcion resuertus:
help-reset-list = Lista de reiníciu nesta entrá:
help-added-on-input = Añidíu nesta entrá:
help-removed-on-input = Quitáu desta entrá:

help-reset-overrides = { $reset } prevaleci sobri { $additional } i { $removed }.
