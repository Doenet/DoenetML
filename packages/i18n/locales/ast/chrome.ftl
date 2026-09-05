# Asturian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the standard of the Academia de la Llingua Asturiana.
#
# Two plural categories, `one` and `other`, and `one` does not catch zero, so
# the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Comprobando…
answer-submitting = Unviando…
answer-checking-status = Comprobando la rempuesta
answer-submitting-status = Unviando la rempuesta
answer-correct = Correuto
answer-incorrect = Incorreuto
answer-response-saved = Rempuesta guardada
answer-percent-credit = { $percent }% de puntos
answer-percent-correct = { $percent }% correuto
answer-percent-short = { $percent } %
max-credit-available = Puntos másimos disponibles: { $percent }%
attempts-remaining =
    { $count ->
        [0] nun queden intentos
        [one] queda { $count } intentu
       *[other] queden { $count } intentos
    }
validation-correct = (Correuto)
validation-incorrect = (Incorreuto)
validation-partially-correct = (Parcialmente correuto)
answer-show-responses =
    { $count ->
        [one] Amosar { $count } rempuesta a { $answerId }
       *[other] Amosar { $count } rempuestes a { $answerId }
    }

## Disclosure panels

feedback-heading = Comentariu
collapsible-click-to-open = (calca p'abrir)
collapsible-click-to-close = (calca pa zarrar)
collapsible-initializing = Aniciando…
footnote-show = Amosar la nota
footnote-hide = Anubrir la nota
description-more-information = más información

## Controls

slider-previous = Anterior
slider-next = Siguiente
keyboard-open = Abrir el tecláu
keyboard-close = Zarrar el tecláu
choice-input-remove-choice = Quitar { $choice }
matrix-remove-row = Quitar una filera
matrix-add-row = Amestar una filera
matrix-remove-column = Quitar una columna
matrix-add-column = Amestar una columna
subset-add-remove-points = Amestar/quitar puntos
subset-toggle-points-intervals = Camudar ente puntos ya intervalos
subset-move-points = Mover los puntos
subset-clear = Llimpiar
orbital-add-row = Amestar una filera
orbital-remove-row = Quitar una filera
orbital-add-box = Amestar una caxa
orbital-remove-box = Quitar una caxa
orbital-add-up-arrow = Amestar una flecha p'arriba
orbital-add-down-arrow = Amestar una flecha p'abaxo
orbital-remove-arrow = Quitar una flecha
orbital-row-label = Etiqueta de la filera { $row }
pretzel-answer = Rempuesta

## Math input

math-input-preview-region = vista previa de la espresión matemática
math-input-preview = Vista previa
math-input-invalid-expression = Espresión inválida:

## Document status

viewer-initializing = Aniciando…

## Errors

error-heading = Error
error-found-at =
    { $span ->
        [line] Alcontráu na llinia { $startLine }.
       *[lines] Alcontráu nes llinies { $startLine }–{ $endLine }.
    }
document-contains-errors = ¡Esti documentu contién errores!
diagnostic-heading-error = Error
diagnostic-heading-warning = Alvertencia
diagnostic-heading-information = Información
diagnostic-heading-hint = Pista
accessibility-heading-level-1 = Vulneración d'accesibilidá según WCAG AA
accessibility-heading-level-2 = Avisu d'accesibilidá
something-went-wrong = Daqué salió mal.
renderer-load-failed = un módulu de representación nun se pudo cargar. Recarga la páxina.
core-start-failed = El visor del documentu nun se pudo aniciar. Recarga la páxina.
