# Catalan viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Catalan counts in `one`, `many` and `other`, but `many` only ever applies to
# the compact millions, which nothing below counts to. So every
# `{ $count -> … }` keeps the two branches the English source has.


## Answer submission

answer-checking = S'està comprovant…
answer-submitting = S'està enviant…
answer-checking-status = S'està comprovant la resposta
answer-submitting-status = S'està enviant la resposta
answer-correct = Correcte
answer-incorrect = Incorrecte
answer-response-saved = Resposta desada
answer-percent-credit = { $percent }% de la puntuació
answer-percent-correct = { $percent }% correcte
answer-percent-short = { $percent } %
max-credit-available = Puntuació màxima disponible: { $percent }%
attempts-remaining =
    { $count ->
        [0] no queda cap intent
        [one] queda { $count } intent
       *[other] queden { $count } intents
    }
validation-correct = (Correcte)
validation-incorrect = (Incorrecte)
validation-partially-correct = (Parcialment correcte)
answer-show-responses =
    { $count ->
        [one] Mostra { $count } resposta a { $answerId }
       *[other] Mostra { $count } respostes a { $answerId }
    }

## Disclosure panels

feedback-heading = Comentaris
collapsible-click-to-open = (feu clic per obrir)
collapsible-click-to-close = (feu clic per tancar)
collapsible-initializing = S'està inicialitzant…
footnote-show = Mostra la nota al peu
footnote-hide = Amaga la nota al peu
description-more-information = més informació

## Controls

slider-previous = Anterior
slider-next = Següent
keyboard-open = Obre el teclat
keyboard-close = Tanca el teclat
choice-input-remove-choice = Elimina { $choice }
matrix-remove-row = Elimina una fila
matrix-add-row = Afegeix una fila
matrix-remove-column = Elimina una columna
matrix-add-column = Afegeix una columna
subset-add-remove-points = Afegeix/elimina punts
subset-toggle-points-intervals = Alterna entre punts i intervals
subset-move-points = Mou els punts
subset-clear = Neteja
orbital-add-row = Afegeix una fila
orbital-remove-row = Elimina una fila
orbital-add-box = Afegeix una casella
orbital-remove-box = Elimina una casella
orbital-add-up-arrow = Afegeix una fletxa amunt
orbital-add-down-arrow = Afegeix una fletxa avall
orbital-remove-arrow = Elimina una fletxa
orbital-row-label = Etiqueta de la fila { $row }
pretzel-answer = Resposta

## Math input

math-input-preview-region = previsualització de l'expressió matemàtica
math-input-preview = Previsualització
math-input-invalid-expression = Expressió no vàlida:

## Document status

viewer-initializing = S'està inicialitzant…

## Errors

error-heading = Error
error-found-at =
    { $span ->
        [line] Trobat a la línia { $startLine }.
       *[lines] Trobat a les línies { $startLine }–{ $endLine }.
    }
document-contains-errors = Aquest document conté errors!
diagnostic-heading-error = Error
diagnostic-heading-warning = Advertiment
diagnostic-heading-information = Informació
diagnostic-heading-hint = Suggeriment
accessibility-heading-level-1 = Incompliment d'accessibilitat WCAG AA
accessibility-heading-level-2 = Avís d'accessibilitat
something-went-wrong = Alguna cosa ha anat malament.
renderer-load-failed = un renderitzador no s'ha pogut carregar. Torneu a carregar la pàgina.
core-start-failed = No s'ha pogut iniciar el visualitzador del document. Torneu a carregar la pàgina.
