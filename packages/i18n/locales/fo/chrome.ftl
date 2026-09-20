# Faroese viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Faroese counts in the same two plural categories English does, so every
# `{ $count -> … }` below keeps the shape it had.


## Answer submission

answer-checking = Kannar…
answer-submitting = Sendir…
answer-checking-status = Kannar svarið
answer-submitting-status = Sendir svarið
answer-correct = Rætt
answer-incorrect = Skeivt
answer-response-saved = Svarið er goymt
answer-percent-credit = { $percent }% av stigunum
answer-percent-correct = { $percent }% rætt
answer-percent-short = { $percent } %
max-credit-available = Hægst møguligt stig: { $percent }%
attempts-remaining =
    { $count ->
        [0] eingin roynd eftir
        [one] { $count } roynd eftir
       *[other] { $count } royndir eftir
    }
validation-correct = (Rætt)
validation-incorrect = (Skeivt)
validation-partially-correct = (Partvíst rætt)
answer-show-responses =
    { $count ->
        [one] Vís { $count } svar til { $answerId }
       *[other] Vís { $count } svør til { $answerId }
    }

## Disclosure panels

feedback-heading = Afturmelding
collapsible-click-to-open = (trýst fyri at lata upp)
collapsible-click-to-close = (trýst fyri at lata aftur)
collapsible-initializing = Byrjar…
footnote-show = Vís fótnotu
footnote-hide = Fjal fótnotu
description-more-information = meiri kunning

## Controls

slider-previous = Fyrra
slider-next = Næsta
keyboard-open = Lat upp knappaborðið
keyboard-close = Lat knappaborðið aftur
choice-input-remove-choice = Tak { $choice } burtur
matrix-remove-row = Tak rað burtur
matrix-add-row = Legg rað afturat
matrix-remove-column = Tak dálk burtur
matrix-add-column = Legg dálk afturat
subset-add-remove-points = Legg punkt afturat / tak punkt burtur
subset-toggle-points-intervals = Skift millum punkt og millumbil
subset-move-points = Flyt punktini
subset-clear = Rudda
orbital-add-row = Legg rað afturat
orbital-remove-row = Tak rað burtur
orbital-add-box = Legg kassa afturat
orbital-remove-box = Tak kassa burtur
orbital-add-up-arrow = Legg píl upp afturat
orbital-add-down-arrow = Legg píl niður afturat
orbital-remove-arrow = Tak píl burtur
orbital-row-label = Merki fyri rað { $row }
pretzel-answer = Svar

## Math input

math-input-preview-region = forsýning av støddfrøðiliga úttrykkinum
math-input-preview = Forsýning
math-input-invalid-expression = Ógildugt úttrykk:

## Document status

viewer-initializing = Byrjar…

## Errors

error-heading = Villa
error-found-at =
    { $span ->
        [line] Funnið á linju { $startLine }.
       *[lines] Funnið á linjum { $startLine }–{ $endLine }.
    }
document-contains-errors = Hetta skjalið hevur villur í sær!
diagnostic-heading-error = Villa
diagnostic-heading-warning = Ávaring
diagnostic-heading-information = Kunning
diagnostic-heading-hint = Vísbending
accessibility-heading-level-1 = Brot á WCAG AA atkomukrøv
accessibility-heading-level-2 = Atkomuávaring
something-went-wrong = Okkurt fór skeivt.
renderer-load-failed = ein teknari kundi ikki lastast. Endurles síðuna.
core-start-failed = Skjalavísarin kundi ikki byrja. Endurles síðuna.
