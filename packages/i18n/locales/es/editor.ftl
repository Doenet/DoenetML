# Superficies del editor: el pie, el panel de diagnósticos, el selector de
# variantes y el botón de accesibilidad. Se selecciona con `uiLocale`.
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
