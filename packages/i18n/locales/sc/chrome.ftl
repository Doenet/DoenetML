# Sardinian viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Limba Sarda Comuna; see `content.ftl`'s header.
#
# Two plural categories, `one` and `other`, and `one` does not catch zero, so
# the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Controllende…
answer-submitting = Imbiende…
answer-checking-status = Controllende sa risposta
answer-submitting-status = Imbiende sa risposta
answer-correct = Curretu
answer-incorrect = Non curretu
answer-response-saved = Risposta sarvada
answer-percent-credit = { $percent }% de puntos
answer-percent-correct = { $percent }% curretu
answer-percent-short = { $percent } %
max-credit-available = Puntos màssimos possìbiles: { $percent }%
attempts-remaining =
    { $count ->
        [0] no b'at prus proas
        [one] b'at ancora { $count } proa
       *[other] b'at ancora { $count } proas
    }
validation-correct = (Curretu)
validation-incorrect = (Non curretu)
validation-partially-correct = (In parte curretu)
answer-show-responses =
    { $count ->
        [one] Ammustra { $count } risposta a { $answerId }
       *[other] Ammustra { $count } rispostas a { $answerId }
    }

## Disclosure panels

feedback-heading = Cummentu
collapsible-click-to-open = (crica pro abèrrere)
collapsible-click-to-close = (crica pro serrare)
collapsible-initializing = Aviende…
footnote-show = Ammustra sa nota
footnote-hide = Cua sa nota
description-more-information = prus informatziones

## Controls

slider-previous = Pretzedente
slider-next = Sighente
keyboard-open = Aberi sa tastiera
keyboard-close = Serra sa tastiera
choice-input-remove-choice = Boga { $choice }
matrix-remove-row = Boga una riga
matrix-add-row = Annanghe una riga
matrix-remove-column = Boga una colunna
matrix-add-column = Annanghe una colunna
subset-add-remove-points = Annanghe/boga puntos
subset-toggle-points-intervals = Càmbia intre puntos e intervallos
subset-move-points = Move sos puntos
subset-clear = Lìmpia
orbital-add-row = Annanghe una riga
orbital-remove-row = Boga una riga
orbital-add-box = Annanghe una casella
orbital-remove-box = Boga una casella
orbital-add-up-arrow = Annanghe una fritza a subra
orbital-add-down-arrow = Annanghe una fritza a bassu
orbital-remove-arrow = Boga una fritza
orbital-row-label = Etichetta de sa riga { $row }
pretzel-answer = Risposta

## Math input

math-input-preview-region = anteprima de s'espressione matemàtica
math-input-preview = Anteprima
math-input-invalid-expression = Espressione non vàlida:

## Document status

viewer-initializing = Aviende…

## Errors

error-heading = Errore
error-found-at =
    { $span ->
        [line] Agatadu in sa lìnia { $startLine }.
       *[lines] Agatadu in sas lìnias { $startLine }–{ $endLine }.
    }
document-contains-errors = Custu documentu tenet errores!
diagnostic-heading-error = Errore
diagnostic-heading-warning = Avisu
diagnostic-heading-information = Informatzione
diagnostic-heading-hint = Cussìgiu
accessibility-heading-level-1 = Violatzione de s'atzessibilidade segundu WCAG AA
accessibility-heading-level-2 = Avisu de atzessibilidade
something-went-wrong = Calchi cosa est andada male.
renderer-load-failed = unu mòdulu de visualizatzione non s'est carrigadu. Càrriga torra sa pàgina.
core-start-failed = Su visualizadore de su documentu non s'est pòdidu aviare. Càrriga torra sa pàgina.
