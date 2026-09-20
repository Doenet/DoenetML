# Ladino / Judeo-Spanish (djudeoespanyol) editor and language-server surfaces:
# the footer, the diagnostics panel, the variant picker, the accessibility
# button and the context-help panel. Selected by `uiLocale`.
# `locales/en/editor.ftl` is the source of truth and message ids are never
# translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script.** Latin script in the **Aki Yerushalayim** orthography. Ladino was
# written in Hebrew (Rashi, solitreo) letters for four centuries, but the Latin
# Aki Yerushalayim spelling is what a reader meets today, so this catalog lays
# out **left to right**. See `chrome.ftl` for the whole note. Latin digits
# throughout.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **What is Ladino here.** «no se puede», «deve», «se topa» for *is found*,
# «trokar», «ke», «i» for *and*, «ma», «aki», «dainda» for *yet*, «aprieta»
# for *press*, and the ⟨k⟩ / ⟨v⟩ / ⟨sh⟩ spelling throughout. The editor's
# technical vocabulary — «atributo», «komponente», «varyante», «referensia»,
# «diagnostiko», «formatar» — is the Spanish learned Romance layer respelt into
# Aki Yerushalayim, borrowed without disguise: a Ladino speaker's own computing
# words are Hebrew or Turkish and could not sit in these sentences.
#
# **Counts.** CLDR has **no plural data for `lad`**, so no `[one]`, `[zero]`,
# `[two]`, `[few]` or `[many]` branch appears anywhere. Where English selects
# on a count — the WCAG violation count in `editor-accessibility-label`, and
# `help-coordinates` — one form is written that reads for any number. In
# `help-coordinates` that form is the plural «Koordenadas:», which is the label
# an editor pane wants in any case.
#
# **Weakest first.** «formatar», «varyante» and the whole editor register:
# Ladino has no established software usage to check them against.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reinisiar
       *[update] Aktualizar
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } el vizor
       *[other] { $word } el vizor { $shortcut }
    }


## The variant picker

editor-variant = Varyante
editor-variant-filter = Filtrar…
editor-variant-next = Eskojer la varyante sigiente
editor-variant-previous = Eskojer la varyante anterior


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Se topo una violasion de aksesibilidad WCAG AA. Aprieta para { $action ->
            [close] serrar
           *[open] avrir
        } el raporto de aksesibilidad.
        [advisories] Aprieta para { $action ->
            [close] serrar
           *[open] avrir
        } el raporto de aksesibilidad. No se topo ninguna violasion WCAG AA, ma ay otras rekomendasiones de aksesibilidad.
       *[clean] Aprieta para { $action ->
            [close] serrar
           *[open] avrir
        } el raporto de aksesibilidad. No se topo dingun problema de aksesibilidad.
    }

editor-accessibility-label =
    { $status ->
        [violations] Se topo una violasion de aksesibilidad WCAG AA. Se toparon { $count } violasiones WCAG AA. Aprieta para { $action ->
            [close] serrar
           *[open] avrir
        } el raporto de aksesibilidad.
        [advisories] No se topo ninguna violasion WCAG AA. Se toparon { $count } rekomendasiones de aksesibilidad mas. Aprieta para { $action ->
            [close] serrar
           *[open] avrir
        } el raporto de aksesibilidad.
       *[clean] No se topo ninguna violasion WCAG AA. Aprieta para { $action ->
            [close] serrar
           *[open] avrir
        } el raporto de aksesibilidad.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versyon de DoenetML { $version }

editor-tab-help = Ayudo sigun el konteksto
editor-tab-help-short = Konteksto
editor-tab-errors = Yerros
editor-tab-warnings = Advertensias
editor-tab-info = Informasion
editor-tab-accessibility = Aksesibilidad
editor-tab-responses = Repuestas mandadas

editor-tab-with-count = { $label }: { $count }

editor-options = Opsiones del editor
editor-format-as-doenetml = Formatar komo DoenetML
editor-format-as-xml = Formatar komo XML


## The diagnostics panel

editor-diagnostic-line = Linya #{ $line }

editor-no-errors = Dingun yerro
editor-no-warnings = Ninguna advertensia
editor-no-info = Dingun diagnostiko de informasion

editor-show-info-annotations = Amostrar los diagnostikos de informasion en el editor
editor-show-accessibility-annotations = Amostrar los diagnostikos de aksesibilidad en el editor

editor-accessibility-learn-more = Ambeza komo Doenet entiende la aksesibilidad

editor-accessibility-violations-heading = Violasiones de aksesibilidad ({ $standard })

editor-accessibility-other-heading = Otros problemas de aksesibilidad
editor-none-found = No se topo dinguno

## Submitted responses

editor-no-responses = Dainda no ay ninguna repuesta mandada
editor-response-answer-id = Id de la repuesta
editor-response-response = Repuesta
editor-response-credit = Puntos
editor-response-submitted = Mandada


## The context-help panel

help-placeholder = Pon el kursor sovre un nombre de etiketa, un atributo o { $ref } para la dokumentasion.

help-unsupported-ref-chain = El ayudo para las referensias de munchas partes komo { $example } dainda no esta pronto.

help-unresolved-ref =
    { $reason ->
        [notFound] No se topo dingun referente para la referensia: { $ref }.
        [multiple] Se toparon munchos referentes para la referensia: { $ref }.
       *[indeterminate] No se pudo determinar un referente para { $ref }.
    }

help-learn-about-references = Ambeza sovre las referensias →
help-reference-page = Pajina de referensia →

help-suggestions-header =
    { $location ->
        [inside] Adientro de { $element }
       *[top] En el nivel de mas arriva
    }{ $allowed ->
        [none] { " — aki no va nada." }
        [text] { " — eskrive teksto aki." }
        [text-and-components] { " — eskrive teksto aki, o prova:" }
       *[components] { " — kozas para provar:" }
    }

help-suggestions-footer = Aprieta { $shortcut } para ver los { $total } komponentes.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } es una referensia a { $target }.
       *[other] { $ref } es una referensia a { $target } (linya { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Metido por { $owner } komo { $role }.
       *[other] Metido por { $owner } en la linya { $line } komo { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } es una referensia a la propiedad { $property } de { $element }.
       *[other] { $ref } es una referensia a la propiedad { $property } de { $element } (linya { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = fragmento
help-kind-array-entry = entrada de vektor

help-default = Por defekto:
help-active-default = Por defekto aktivo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valores permetidos (uno por elemento):
       *[other] Valores permetidos:
    }

help-suggested-values = Valores sujeridos:

help-inserts = Mete:

# CLDR has no plural data for `lad`, so no `[one]` branch is written: the
# plural form is the one an editor pane wants for a list of coordinates in any
# case.
help-coordinates = Koordenadas:

help-type = Tipo:

help-resolved-style = Estilo rezolvido (styleNumber { $styleNumber }):

help-resolved-function-names = Nombres de funksion rezolvidos:
help-reset-list = Lista de reinisio en esta entrada:
help-added-on-input = Adjustado en esta entrada:
help-removed-on-input = Kitado de esta entrada:

help-reset-overrides = { $reset } prevalese sovre { $additional } i { $removed }.
