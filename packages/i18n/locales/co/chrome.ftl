# Corsican viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Two plural categories, `one` and `other`, and `one` does not catch zero, so
# the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Verificazione…
answer-submitting = Mandata…
answer-checking-status = Verificazione di a risposta
answer-submitting-status = Mandata di a risposta
answer-correct = Ghjustu
answer-incorrect = Sbagliatu
answer-response-saved = Risposta arregistrata
answer-percent-credit = { $percent }% di punti
answer-percent-correct = { $percent }% ghjustu
answer-percent-short = { $percent } %
max-credit-available = Punti massimi pussibuli: { $percent }%
attempts-remaining =
    { $count ->
        [0] ùn ci sò più prove
        [one] ferma { $count } prova
       *[other] fermanu { $count } prove
    }
validation-correct = (Ghjustu)
validation-incorrect = (Sbagliatu)
validation-partially-correct = (In parte ghjustu)
answer-show-responses =
    { $count ->
        [one] Mustrà { $count } risposta à { $answerId }
       *[other] Mustrà { $count } risposte à { $answerId }
    }

## Disclosure panels

feedback-heading = Cummentu
collapsible-click-to-open = (cliccà per apre)
collapsible-click-to-close = (cliccà per chjude)
collapsible-initializing = Avviu…
footnote-show = Mustrà a nota
footnote-hide = Piattà a nota
description-more-information = più infurmazione

## Controls

slider-previous = Precedente
slider-next = Seguente
keyboard-open = Apre a tastera
keyboard-close = Chjude a tastera
choice-input-remove-choice = Toglie { $choice }
matrix-remove-row = Toglie una fila
matrix-add-row = Aghjunghje una fila
matrix-remove-column = Toglie una culonna
matrix-add-column = Aghjunghje una culonna
subset-add-remove-points = Aghjunghje/toglie punti
subset-toggle-points-intervals = Cambià trà punti è intervalli
subset-move-points = Spustà i punti
subset-clear = Nettà
orbital-add-row = Aghjunghje una fila
orbital-remove-row = Toglie una fila
orbital-add-box = Aghjunghje una casella
orbital-remove-box = Toglie una casella
orbital-add-up-arrow = Aghjunghje una freccia in sù
orbital-add-down-arrow = Aghjunghje una freccia in ghjù
orbital-remove-arrow = Toglie una freccia
orbital-row-label = Etichetta di a fila { $row }
pretzel-answer = Risposta

## Math input

math-input-preview-region = anteprima di l'espressione matematica
math-input-preview = Anteprima
math-input-invalid-expression = Espressione invalida:

## Document status

viewer-initializing = Avviu…

## Errors

error-heading = Errore
error-found-at =
    { $span ->
        [line] Trovu à a linea { $startLine }.
       *[lines] Trovu à e linee { $startLine }–{ $endLine }.
    }
document-contains-errors = Stu documentu cuntene errori!
diagnostic-heading-error = Errore
diagnostic-heading-warning = Avvertimentu
diagnostic-heading-information = Infurmazione
diagnostic-heading-hint = Indiziu
accessibility-heading-level-1 = Viulazione di l'accessibilità secondu WCAG AA
accessibility-heading-level-2 = Avvisu d'accessibilità
something-went-wrong = Qualcosa hè andata male.
renderer-load-failed = un modulu di visualizazione ùn s'hè caricatu. Ricarica a pagina.
core-start-failed = U visualizatore di u documentu ùn s'hè pussutu avvià. Ricarica a pagina.
