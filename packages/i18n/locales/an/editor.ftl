# Aragonese (aragonés) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`. `locales/en/editor.ftl` is the
# source of truth and message ids are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script in the Academia de l'Aragonés / EFA
# *Propuesta ortografica* (2010); see `chrome.ftl`. Numbers in Latin digits.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **What is Aragonese here.** «ye», «puet», «no s'ha puesto», «cal», «fe clic»,
# «amostrar», «bushcar»-free plain «trobau», the article «o / a / os / as» and
# its contractions «d'o», «d'a». The editor's technical vocabulary —
# «atributo», «component», «variant», «formatar», «referencia» — is the learned
# Romance layer that reaches Aragonese through **Spanish**, and is borrowed
# without disguise.
#
# **Counts.** CLDR has plural rules for `an` (`one`, `other`), so the two
# `[one]` / `*[other]` selects English writes here — the WCAG violation count
# and `help-coordinates` — are kept and are genuinely selected.
#
# **Weakest first.** «formatar» for *format* and «fayena» in the sectional
# vocabulary are guesses; so is the whole register of a text editor, for which
# Aragonese has no established usage.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reiniciar
       *[update] Esviellar
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } o visor
       *[other] { $word } o visor { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtrar…
editor-variant-next = Trigar a variant siguient
editor-variant-previous = Trigar a variant anterior


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] S'ha trobau una vulneración d'accesibilidat WCAG AA. Fe clic ta { $action ->
            [close] zarrar
           *[open] ubrir
        } o informe d'accesibilidat.
        [advisories] Fe clic ta { $action ->
            [close] zarrar
           *[open] ubrir
        } o informe d'accesibilidat. No s'ha trobau garra vulneración WCAG AA, pero i hai atras recomendacions d'accesibilidat.
       *[clean] Fe clic ta { $action ->
            [close] zarrar
           *[open] ubrir
        } o informe d'accesibilidat. No s'ha trobau garra problema d'accesibilidat.
    }

editor-accessibility-label =
    { $status ->
        [violations] S'ha trobau una vulneración d'accesibilidat WCAG AA. S'han trobau { $count ->
            [one] { $count } vulneración WCAG AA
           *[other] { $count } vulneracions WCAG AA
        }. Fe clic ta { $action ->
            [close] zarrar
           *[open] ubrir
        } o informe d'accesibilidat.
        [advisories] No s'ha trobau garra vulneración WCAG AA. S'han trobau { $count ->
            [one] { $count } recomendación d'accesibilidat mas
           *[other] { $count } recomendacions d'accesibilidat mas
        }. Fe clic ta { $action ->
            [close] zarrar
           *[open] ubrir
        } o informe d'accesibilidat.
       *[clean] No s'ha trobau garra vulneración WCAG AA. Fe clic ta { $action ->
            [close] zarrar
           *[open] ubrir
        } o informe d'accesibilidat.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versión de DoenetML { $version }

editor-tab-help = Aduya seguntes o contexto
editor-tab-help-short = Contexto
editor-tab-errors = Errors
editor-tab-warnings = Alvertencias
editor-tab-info = Información
editor-tab-accessibility = Accesibilidat
editor-tab-responses = Respuestas ninviadas

editor-tab-with-count = { $label }: { $count }

editor-options = Opcions de l'editor
editor-format-as-doenetml = Formatar como DoenetML
editor-format-as-xml = Formatar como XML


## The diagnostics panel

editor-diagnostic-line = Linia #{ $line }

editor-no-errors = Garra error
editor-no-warnings = Garra alvertencia
editor-no-info = Garra diagnostico d'información

editor-show-info-annotations = Amostrar os diagnosticos d'información en l'editor
editor-show-accessibility-annotations = Amostrar os diagnosticos d'accesibilidat en l'editor

editor-accessibility-learn-more = Aprende cómo Doenet encara l'accesibilidat

editor-accessibility-violations-heading = Vulneracions d'accesibilidat ({ $standard })

editor-accessibility-other-heading = Atros problemas d'accesibilidat
editor-none-found = No s'ha trobau garra

## Submitted responses

editor-no-responses = Encara no i hai garra respuesta ninviada
editor-response-answer-id = Id d'a respuesta
editor-response-response = Respuesta
editor-response-credit = Puntos
editor-response-submitted = Ninviada


## The context-help panel

help-placeholder = Mete o cursor sobre un nombre d'etiqueta, un atributo u { $ref } ta la documentación.

help-unsupported-ref-chain = L'aduya ta as referencias de cuantas partes como { $example } encara no ye disponible.

help-unresolved-ref =
    { $reason ->
        [notFound] No s'ha trobau garra referent ta la referencia: { $ref }.
        [multiple] S'han trobau cuantos referents ta la referencia: { $ref }.
       *[indeterminate] No s'ha puesto determinar un referent ta { $ref }.
    }

help-learn-about-references = Aprende sobre as referencias →
help-reference-page = Pachina de referencia →

help-suggestions-header =
    { $location ->
        [inside] Adentro de { $element }
       *[top] En o libel superior
    }{ $allowed ->
        [none] { " — aquí no i va cosa." }
        [text] { " — escribe texto aquí." }
        [text-and-components] { " — escribe texto aquí, u preba:" }
       *[components] { " — cosas ta prebar:" }
    }

help-suggestions-footer = Preta { $shortcut } ta veyer os { $total } components.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ye una referencia a { $target }.
       *[other] { $ref } ye una referencia a { $target } (linia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introduciu por { $owner } como { $role }.
       *[other] Introduciu por { $owner } en a linia { $line } como { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ye una referencia a la propiedat { $property } de { $element }.
       *[other] { $ref } ye una referencia a la propiedat { $property } de { $element } (linia { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = fragmento
help-kind-array-entry = dentrada de vector

help-default = Predeterminau:
help-active-default = Predeterminau activo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valors premitius (un por elemento):
       *[other] Valors premitius:
    }

help-suggested-values = Valors sucheritos:

help-inserts = Ficar:

help-coordinates =
    { $count ->
        [one] Coordenada:
       *[other] Coordenadas:
    }

help-type = Tipo:

help-resolved-style = Estilo resuelto (styleNumber { $styleNumber }):

help-resolved-function-names = Nombres de función resueltos:
help-reset-list = Lista de reinicio en ista dentrada:
help-added-on-input = Adhibiu en ista dentrada:
help-removed-on-input = Sacau d'ista dentrada:

help-reset-overrides = { $reset } prevalece sobre { $additional } y { $removed }.
