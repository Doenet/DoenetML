# Galician viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Galician counts in the same two plural categories English does, so every
# `{ $count -> … }` below keeps the shape it had.


## Answer submission

answer-checking = Comprobando…
answer-submitting = Enviando…
answer-checking-status = Comprobando a resposta
answer-submitting-status = Enviando a resposta
answer-correct = Correcto
answer-incorrect = Incorrecto
answer-response-saved = Resposta gardada
answer-percent-credit = { $percent }% da puntuación
answer-percent-correct = { $percent }% correcto
answer-percent-short = { $percent } %
max-credit-available = Puntuación máxima dispoñible: { $percent }%
attempts-remaining =
    { $count ->
        [0] non queda ningún intento
        [one] queda { $count } intento
       *[other] quedan { $count } intentos
    }
validation-correct = (Correcto)
validation-incorrect = (Incorrecto)
validation-partially-correct = (Parcialmente correcto)
answer-show-responses =
    { $count ->
        [one] Amosar { $count } resposta a { $answerId }
       *[other] Amosar { $count } respostas a { $answerId }
    }

## Disclosure panels

feedback-heading = Comentarios
collapsible-click-to-open = (prema para abrir)
collapsible-click-to-close = (prema para pechar)
collapsible-initializing = Inicializando…
footnote-show = Amosar a nota ao pé
footnote-hide = Agochar a nota ao pé
description-more-information = máis información

## Controls

slider-previous = Anterior
slider-next = Seguinte
keyboard-open = Abrir o teclado
keyboard-close = Pechar o teclado
choice-input-remove-choice = Quitar { $choice }
matrix-remove-row = Quitar unha fila
matrix-add-row = Engadir unha fila
matrix-remove-column = Quitar unha columna
matrix-add-column = Engadir unha columna
subset-add-remove-points = Engadir/quitar puntos
subset-toggle-points-intervals = Alternar entre puntos e intervalos
subset-move-points = Mover os puntos
subset-clear = Limpar
orbital-add-row = Engadir unha fila
orbital-remove-row = Quitar unha fila
orbital-add-box = Engadir unha caixa
orbital-remove-box = Quitar unha caixa
orbital-add-up-arrow = Engadir unha frecha cara arriba
orbital-add-down-arrow = Engadir unha frecha cara abaixo
orbital-remove-arrow = Quitar unha frecha
orbital-row-label = Etiqueta da fila { $row }
pretzel-answer = Resposta

## Math input

math-input-preview-region = vista previa da expresión matemática
math-input-preview = Vista previa
math-input-invalid-expression = Expresión non válida:

## Document status

viewer-initializing = Inicializando…

## Errors

error-heading = Erro
error-found-at =
    { $span ->
        [line] Atopado na liña { $startLine }.
       *[lines] Atopado nas liñas { $startLine }–{ $endLine }.
    }
document-contains-errors = Este documento contén erros!
diagnostic-heading-error = Erro
diagnostic-heading-warning = Aviso
diagnostic-heading-information = Información
diagnostic-heading-hint = Suxestión
accessibility-heading-level-1 = Incumprimento de accesibilidade WCAG AA
accessibility-heading-level-2 = Alerta de accesibilidade
something-went-wrong = Algo foi mal.
renderer-load-failed = non se puido cargar un renderizador. Recargue a páxina.
core-start-failed = Non se puido iniciar o visualizador do documento. Recargue a páxina.
