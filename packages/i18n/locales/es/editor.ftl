# Superficies del editor: el pie, el panel de diagnósticos, el selector de
# variantes, el botón de accesibilidad y el panel de ayuda contextual.
# Se selecciona con `uiLocale`.
#
# `WCAG AA` es el nombre de la norma y no se traduce.


## Los controles del visor

editor-update-viewer =
    { $action ->
        [reset] Reiniciar
       *[update] Actualizar
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } el visor
       *[other] { $word } el visor { $shortcut }
    }


## El selector de variantes

editor-variant = Variante
editor-variant-filter = Filtrar...
editor-variant-next = Seleccionar la variante siguiente
editor-variant-previous = Seleccionar la variante anterior


## El botón de estado de accesibilidad

editor-accessibility-title =
    { $status ->
        [violations] Se detectó una infracción de accesibilidad WCAG AA. Pulse para { $action ->
            [close] cerrar
           *[open] abrir
        } el informe de accesibilidad.
        [advisories] Pulse para { $action ->
            [close] cerrar
           *[open] abrir
        } el informe de accesibilidad. No se detectaron infracciones WCAG AA, pero hay recomendaciones adicionales de accesibilidad.
       *[clean] Pulse para { $action ->
            [close] cerrar
           *[open] abrir
        } el informe de accesibilidad. No se detectó ningún problema de accesibilidad.
    }

editor-accessibility-label =
    { $status ->
        [violations] Se detectó una infracción de accesibilidad WCAG AA. Se { $count ->
            [one] encontró { $count } infracción WCAG AA
           *[other] encontraron { $count } infracciones WCAG AA
        }. Pulse para { $action ->
            [close] cerrar
           *[open] abrir
        } el informe de accesibilidad.
        [advisories] No se detectaron infracciones WCAG AA. Se { $count ->
            [one] encontró { $count } recomendación adicional de accesibilidad
           *[other] encontraron { $count } recomendaciones adicionales de accesibilidad
        }. Pulse para { $action ->
            [close] cerrar
           *[open] abrir
        } el informe de accesibilidad.
       *[clean] No se detectaron infracciones WCAG AA. Pulse para { $action ->
            [close] cerrar
           *[open] abrir
        } el informe de accesibilidad.
    }

editor-accessibility-badge = WCAG


## El pie

editor-version-title = Versión de DoenetML { $version }

editor-tab-help = Ayuda contextual
editor-tab-help-short = Contexto
editor-tab-errors = Errores
editor-tab-warnings = Advertencias
editor-tab-info = Información
editor-tab-accessibility = Accesibilidad
editor-tab-responses = Respuestas enviadas

editor-tab-with-count = { $label }: { $count }

editor-options = Opciones del editor
editor-format-as-doenetml = Formatear como DoenetML
editor-format-as-xml = Formatear como XML


## El panel de diagnósticos

editor-diagnostic-line = Línea n.º { $line }

editor-no-errors = Sin errores
editor-no-warnings = Sin advertencias
editor-no-info = Sin diagnósticos informativos

editor-show-info-annotations = Mostrar los diagnósticos informativos en el editor
editor-show-accessibility-annotations = Mostrar los diagnósticos de accesibilidad en el editor

editor-accessibility-learn-more = Descubra cómo Doenet aborda la accesibilidad

editor-accessibility-violations-heading = Infracciones de accesibilidad ({ $standard })

editor-accessibility-other-heading = Otros problemas de accesibilidad
editor-none-found = No se encontró ninguno


## Respuestas enviadas

editor-no-responses = Todavía no hay respuestas enviadas
editor-response-answer-id = Id. de respuesta
editor-response-response = Respuesta
editor-response-credit = Puntuación
editor-response-submitted = Enviada


## El panel de ayuda contextual
##
## Los fragmentos con formato — un nombre de elemento en `<code>`, un enlace —
## llegan como argumentos y se vuelven a insertar después de formatear el
## mensaje, de modo que la traducción decide dónde va cada uno.

help-placeholder = Coloque el cursor sobre el nombre de una etiqueta, un atributo o { $ref } para ver la documentación.

help-unsupported-ref-chain = Todavía no hay ayuda para las referencias de varias partes como { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] No se encontró ningún referente para la referencia: { $ref }.
        [multiple] Se encontraron varios referentes para la referencia: { $ref }.
       *[indeterminate] No se pudo determinar un referente para { $ref }.
    }

help-learn-about-references = Más información sobre las referencias →
help-reference-page = Página de referencia →

help-suggestions-header =
    { $location ->
        [inside] Dentro de { $element }
       *[top] En el nivel superior
    }{ $allowed ->
        [none] { " — aquí no va nada." }
        [text] { " — escriba texto aquí." }
        [text-and-components] { " — escriba texto aquí o pruebe con:" }
       *[components] { " — puede probar con:" }
    }

help-suggestions-footer = Pulse { $shortcut } para ver los { $total } componentes.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } es una referencia a { $target }.
       *[other] { $ref } es una referencia a { $target } (línea { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introducida por { $owner } como { $role }.
       *[other] Introducida por { $owner } en la línea { $line } como { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } es una referencia a la propiedad { $property } de { $element }.
       *[other] { $ref } es una referencia a la propiedad { $property } de { $element } (línea { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = fragmento
help-kind-array-entry = entrada de arreglo

help-default = Valor predeterminado:
help-active-default = Valor predeterminado activo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valores admitidos (uno por elemento):
       *[other] Valores admitidos:
    }

help-suggested-values = Valores sugeridos:

help-inserts = Inserta:

help-coordinates =
    { $count ->
        [one] Coordenada:
       *[other] Coordenadas:
    }

help-type = Tipo:

help-resolved-style = Estilo resuelto (styleNumber { $styleNumber }):

help-resolved-function-names = Nombres de función resueltos:
help-reset-list = Lista restablecida en esta entrada:
help-added-on-input = Añadidos en esta entrada:
help-removed-on-input = Eliminados en esta entrada:

help-reset-overrides = { $reset } prevalece sobre { $additional } y { $removed }.
