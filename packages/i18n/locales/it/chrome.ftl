# Italian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: the bare imperative, which is what Italian puts on a control —
# `Mostra`, `Apri`, `Ricarica`. That is the `tu` form: Italian has no verb
# form neutral between `tu` and `Lei`, and every Italian interface resolves
# it the same way. Statuses stay nominal (`Verifica in corso`), so the
# imperative appears only where the reader is being asked to act.


## Answer submission

answer-checking = Verifica in corso...
answer-submitting = Invio in corso...
answer-checking-status = Verifica della risposta
answer-submitting-status = Invio della risposta
answer-correct = Corretto
answer-incorrect = Errato
answer-response-saved = Risposta salvata
answer-percent-credit = { $percent }% di credito
answer-percent-correct = { $percent }% corretto
answer-percent-short = { $percent } %
max-credit-available = Credito massimo disponibile: { $percent }%
attempts-remaining =
    { $count ->
        [0] nessun tentativo rimasto
        [one] { $count } tentativo rimasto
       *[other] { $count } tentativi rimasti
    }
validation-correct = (Corretto)
validation-incorrect = (Errato)
validation-partially-correct = (Parzialmente corretto)
answer-show-responses =
    { $count ->
        [one] Mostra { $count } risposta a { $answerId }
       *[other] Mostra { $count } risposte a { $answerId }
    }

## Disclosure panels

feedback-heading = Riscontro
collapsible-click-to-open = (clicca per aprire)
collapsible-click-to-close = (clicca per chiudere)
collapsible-initializing = Inizializzazione...
footnote-show = Mostra la nota
footnote-hide = Nascondi la nota
description-more-information = maggiori informazioni

## Controls

slider-previous = Prec.
slider-next = Succ.
keyboard-open = Apri la tastiera
keyboard-close = Chiudi la tastiera
choice-input-remove-choice = Rimuovi { $choice }
matrix-remove-row = Rimuovi riga
matrix-add-row = Aggiungi riga
matrix-remove-column = Rimuovi colonna
matrix-add-column = Aggiungi colonna
subset-add-remove-points = Aggiungi/rimuovi punti
subset-toggle-points-intervals = Alterna punti e intervalli
subset-move-points = Sposta i punti
subset-clear = Cancella
# A `box` here is one orbital, drawn as a square: `casella`.
orbital-add-row = Aggiungi riga
orbital-remove-row = Rimuovi riga
orbital-add-box = Aggiungi casella
orbital-remove-box = Rimuovi casella
orbital-add-up-arrow = Aggiungi freccia in su
orbital-add-down-arrow = Aggiungi freccia in giù
orbital-remove-arrow = Rimuovi freccia
orbital-row-label = Etichetta per la riga { $row }
pretzel-answer = Risposta

## Math input

math-input-preview-region = anteprima dell’espressione matematica
math-input-preview = Anteprima
math-input-invalid-expression = Espressione non valida:

## Document status

viewer-initializing = Inizializzazione...

## Errors

error-heading = Errore
# `Trovato` agrees with `errore`, which is what this sentence follows.
error-found-at =
    { $span ->
        [line] Trovato alla riga { $startLine }.
       *[lines] Trovato alle righe { $startLine }–{ $endLine }.
    }
document-contains-errors = Questo documento contiene errori!
diagnostic-heading-error = Errore
diagnostic-heading-warning = Avviso
diagnostic-heading-information = Info
diagnostic-heading-hint = Suggerimento
accessibility-heading-level-1 = Violazione di accessibilità WCAG AA
accessibility-heading-level-2 = Avviso di accessibilità
something-went-wrong = Qualcosa è andato storto.
renderer-load-failed = non è stato possibile caricare un componente di visualizzazione. Ricarica la pagina.
core-start-failed = Non è stato possibile avviare il visualizzatore del documento. Ricarica la pagina.
