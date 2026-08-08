# Asturian editor and language-server surfaces. Translated from
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
        [reset] Reaniciar
       *[update] Anovar
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } el visor
       *[other] { $word } el visor { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Peñera…
editor-variant-next = Escoyer la variante siguiente
editor-variant-previous = Escoyer la variante anterior


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Identificóse una vulneración d'accesibilidá según WCAG AA. Calca pa { $action ->
            [close] zarrar
           *[open] abrir
        } l'informe d'accesibilidá.
        [advisories] Calca pa { $action ->
            [close] zarrar
           *[open] abrir
        } l'informe d'accesibilidá. Nun s'alcontró denguna vulneración WCAG AA, pero hai más recomendaciones d'accesibilidá.
       *[clean] Calca pa { $action ->
            [close] zarrar
           *[open] abrir
        } l'informe d'accesibilidá. Nun s'alcontró dengún problema d'accesibilidá.
    }

editor-accessibility-label =
    { $status ->
        [violations] Identificóse una vulneración d'accesibilidá según WCAG AA. { $count ->
            [one] Alcontróse { $count } vulneración WCAG AA
           *[other] Alcontráronse { $count } vulneraciones WCAG AA
        }. Calca pa { $action ->
            [close] zarrar
           *[open] abrir
        } l'informe d'accesibilidá.
        [advisories] Nun s'identificó denguna vulneración WCAG AA. { $count ->
            [one] Alcontróse { $count } recomendación d'accesibilidá adicional
           *[other] Alcontráronse { $count } recomendaciones d'accesibilidá adicionales
        }. Calca pa { $action ->
            [close] zarrar
           *[open] abrir
        } l'informe d'accesibilidá.
       *[clean] Nun s'identificó denguna vulneración WCAG AA. Calca pa { $action ->
            [close] zarrar
           *[open] abrir
        } l'informe d'accesibilidá.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versión { $version } de DoenetML

editor-tab-help = Ayuda contestual
editor-tab-help-short = Contestu
editor-tab-errors = Errores
editor-tab-warnings = Alvertencies
editor-tab-info = Información
editor-tab-accessibility = Accesibilidá
editor-tab-responses = Rempuestes unviaes

editor-tab-with-count = { $label }: { $count }

editor-options = Opciones del editor
editor-format-as-doenetml = Formatiar como DoenetML
editor-format-as-xml = Formatiar como XML


## The diagnostics panel

editor-diagnostic-line = Llinia n.º { $line }

editor-no-errors = Nun hai errores
editor-no-warnings = Nun hai alvertencies
editor-no-info = Nun hai mensaxes informativos

editor-show-info-annotations = Amosar los mensaxes informativos nel editor
editor-show-accessibility-annotations = Amosar los mensaxes d'accesibilidá nel editor

editor-accessibility-learn-more = Cómo aborda Doenet l'accesibilidá

editor-accessibility-violations-heading = Vulneraciones d'accesibilidá ({ $standard })

editor-accessibility-other-heading = Otros problemes d'accesibilidá
editor-none-found = Nun s'alcontró nada


## Submitted responses

editor-no-responses = Entá nun hai rempuestes unviaes
editor-response-answer-id = Id de la rempuesta
editor-response-response = Rempuesta
editor-response-credit = Puntos
editor-response-submitted = Unviada


## The context-help panel

help-placeholder = Pon el cursor nun nome d'etiqueta, nun atributu o en { $ref } pa ver la documentación.

help-unsupported-ref-chain = L'ayuda pa referencies de más d'una parte como { $example } entá nun ta sofitada.

help-unresolved-ref =
    { $reason ->
        [notFound] Nun s'alcontró dengún referente pa la referencia: { $ref }.
        [multiple] Alcontróse más d'un referente pa la referencia: { $ref }.
       *[indeterminate] Nun se pudo determinar un referente pa { $ref }.
    }

help-learn-about-references = Deprender más sobre les referencies →
help-reference-page = Páxina de referencia →

help-suggestions-header =
    { $location ->
        [inside] Dientro de { $element }
       *[top] Nel nivel superior
    }{ $allowed ->
        [none] { " — equí nun va nada." }
        [text] { " — escribi testu equí." }
        [text-and-components] { " — escribi testu equí, o prueba:" }
       *[components] { " — prueba:" }
    }

help-suggestions-footer = Calca { $shortcut } pa ver los { $total } componentes.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ye una referencia a { $target }.
       *[other] { $ref } ye una referencia a { $target } (llinia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introducida por { $owner } como { $role }.
       *[other] Introducida por { $owner } na llinia { $line } como { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ye una referencia a la propiedá { $property } de { $element }.
       *[other] { $ref } ye una referencia a la propiedá { $property } de { $element } (llinia { $line }).
    }

help-kind-attribute = atributu
help-kind-snippet = fragmentu
help-kind-array-entry = entrada d'array

help-default = Valor por defeutu:
help-active-default = Valor por defeutu activu:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valores permitíos (unu por elementu):
       *[other] Valores permitíos:
    }

help-suggested-values = Valores suxeríos:

help-inserts = Inxerta:

help-coordinates =
    { $count ->
        [one] Coordenada:
       *[other] Coordenaes:
    }

help-type = Triba:

help-resolved-style = Estilu resueltu (styleNumber { $styleNumber }):

help-resolved-function-names = Nomes de función resueltos:
help-reset-list = Llista de reaniciu nesti campu:
help-added-on-input = Amestao nesti campu:
help-removed-on-input = Quitao nesti campu:

help-reset-overrides = { $reset } prevalez sobre { $additional } y { $removed }.
