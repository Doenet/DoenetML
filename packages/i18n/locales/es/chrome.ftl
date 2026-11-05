# Spanish viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: impersonal throughout — infinitives and bare nouns, never a `tú`
# or `usted` verb form. The viewer does not know how formally a deployment
# addresses its readers, and an impersonal label is correct for both.


## Answer submission

answer-checking = Comprobando...
answer-submitting = Enviando...
answer-checking-status = Comprobando la respuesta
answer-submitting-status = Enviando la respuesta
answer-correct = Correcto
answer-incorrect = Incorrecto
answer-response-saved = Respuesta guardada
# Spanish typographic convention puts a space before the percent sign.
answer-percent-credit = { $percent } % de crédito
answer-percent-correct = { $percent } % correcto
answer-percent-short = { $percent } %
max-credit-available = Crédito máximo disponible: { $percent } %
attempts-remaining =
    { $count ->
        [0] no quedan intentos
        [one] queda { $count } intento
       *[other] quedan { $count } intentos
    }
validation-correct = (Correcto)
validation-incorrect = (Incorrecto)
validation-partially-correct = (Parcialmente correcto)
# `Mostrar` is the infinitive, per the register note above.
answer-show-responses =
    { $count ->
        [one] Mostrar { $count } respuesta a { $answerId }
       *[other] Mostrar { $count } respuestas a { $answerId }
    }

## Disclosure panels

feedback-heading = Comentarios
collapsible-click-to-open = (clic para abrir)
collapsible-click-to-close = (clic para cerrar)
collapsible-initializing = Inicializando...
footnote-show = Mostrar la nota al pie
footnote-hide = Ocultar la nota al pie
description-more-information = más información

## Controls

slider-previous = Anterior
slider-next = Siguiente
keyboard-open = Abrir el teclado
keyboard-close = Cerrar el teclado
choice-input-remove-choice = Eliminar { $choice }
matrix-remove-row = Eliminar fila
matrix-add-row = Añadir fila
matrix-remove-column = Eliminar columna
matrix-add-column = Añadir columna
subset-add-remove-points = Añadir/Eliminar puntos
subset-toggle-points-intervals = Alternar puntos e intervalos
subset-move-points = Mover puntos
subset-clear = Borrar
orbital-add-row = Añadir fila
orbital-remove-row = Eliminar fila
orbital-add-box = Añadir casilla
orbital-remove-box = Eliminar casilla
orbital-add-up-arrow = Añadir flecha hacia arriba
orbital-add-down-arrow = Añadir flecha hacia abajo
orbital-remove-arrow = Eliminar flecha
orbital-row-label = Etiqueta de la fila { $row }
pretzel-answer = Respuesta

## Math input

math-input-preview-region = vista previa de la expresión matemática
math-input-preview = Vista previa
math-input-invalid-expression = Expresión no válida:

## Document status

viewer-initializing = Inicializando...

## Errors

error-heading = Error
# $startLine and $endLine are line numbers, and arrive as text rather than as
# numbers so that line 1234 is not grouped as "1.234".
error-found-at =
    { $span ->
        [line] Encontrado en la línea { $startLine }.
       *[lines] Encontrado en las líneas { $startLine } a { $endLine }.
    }
document-contains-errors = ¡Este documento contiene errores!
# Headings of the tooltip the editor shows over a squiggle.
diagnostic-heading-error = Error
diagnostic-heading-warning = Advertencia
diagnostic-heading-information = Información
diagnostic-heading-hint = Sugerencia
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = Incumplimiento de accesibilidad WCAG AA
accessibility-heading-level-2 = Aviso de accesibilidad
something-went-wrong = Algo salió mal.
# Follows `error-heading` and a colon, so it begins in lower case, as in
# English. The instruction is an infinitive, per the register note above.
renderer-load-failed = no se pudo cargar un componente. Recargar la página.
core-start-failed = No se pudo iniciar el visor del documento. Recargar la página.
