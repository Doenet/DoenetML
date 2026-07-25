# Spanish viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.


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


## Disclosure panels

feedback-heading = Comentarios

solution-click-to-open = (haz clic para abrir)
solution-click-to-close = (haz clic para cerrar)
solution-initializing = Inicializando...

footnote-show = Mostrar la nota
footnote-hide = Ocultar la nota


## Controls

slider-previous = Anterior
slider-next = Siguiente

keyboard-open = Abrir el teclado
keyboard-close = Cerrar el teclado


## Math input

math-input-preview-region = vista previa de la expresión matemática
math-input-preview = Vista previa
math-input-invalid-expression = Expresión no válida:


## Errors

error-heading = Error
