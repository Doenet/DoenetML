# Kinyarwanda viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kinyarwanda has two plural categories, and a noun marks number with a class
# prefix rather than a suffix: «igerageza rimwe», «amagerageza atanu». So the
# selects are kept and the noun changes shape inside them.


## Answer submission

answer-checking = Kugenzura...
answer-submitting = Kohereza...
answer-checking-status = Kugenzura igisubizo
answer-submitting-status = Kohereza igisubizo
answer-correct = Ni cyo
answer-incorrect = Si cyo
answer-response-saved = Igisubizo Cyabitswe
answer-percent-credit = Amanota { $percent }%
answer-percent-correct = { $percent }% Ni cyo
answer-percent-short = { $percent }%
max-credit-available = Amanota ntarengwa ashoboka: { $percent }%
attempts-remaining =
    { $count ->
        [0] nta gerageza risigaye
        [one] hasigaye igerageza { $count }
       *[other] hasigaye amagerageza { $count }
    }
validation-correct = (Ni cyo)
validation-incorrect = (Si cyo)
validation-partially-correct = (Ni cyo ku gice)
answer-show-responses =
    { $count ->
        [one] Erekana igisubizo { $count } kuri { $answerId }
       *[other] Erekana ibisubizo { $count } kuri { $answerId }
    }

## Disclosure panels

feedback-heading = Ibitekerezo
collapsible-click-to-open = (kanda kugira ngo ufungure)
collapsible-click-to-close = (kanda kugira ngo ufunge)
collapsible-initializing = Gutangira...
footnote-show = Erekana inyandiko yo hasi
footnote-hide = Hisha inyandiko yo hasi
description-more-information = amakuru arushijeho

## Controls

slider-previous = Inyuma
slider-next = Imbere
keyboard-open = Fungura Klavye
keyboard-close = Funga Klavye
choice-input-remove-choice = Kuraho { $choice }
matrix-remove-row = Kuraho umurongo
matrix-add-row = Ongeraho umurongo
matrix-remove-column = Kuraho inkingi
matrix-add-column = Ongeraho inkingi
subset-add-remove-points = Ongeraho/Kuraho ududomo
subset-toggle-points-intervals = Hindura hagati y'ududomo n'intera
subset-move-points = Himura Ududomo
subset-clear = Siba
# A `box` here is one orbital, drawn as a square: agasanduku.
orbital-add-row = Ongeraho Umurongo
orbital-remove-row = Kuraho Umurongo
orbital-add-box = Ongeraho Agasanduku
orbital-remove-box = Kuraho Agasanduku
orbital-add-up-arrow = Ongeraho Akambi Kajya Hejuru
orbital-add-down-arrow = Ongeraho Akambi Kajya Hasi
orbital-remove-arrow = Kuraho Akambi
orbital-row-label = Akarango k'umurongo { $row }
pretzel-answer = Igisubizo

## Math input

math-input-preview-region = igaragazwa ry'imvugo y'imibare
math-input-preview = Igaragazwa
math-input-invalid-expression = Imvugo itemewe:

## Document status

viewer-initializing = Gutangira...

## Errors

error-heading = Ikosa
error-found-at =
    { $span ->
        [line] Ryabonetse ku murongo { $startLine }.
       *[lines] Ryabonetse ku mirongo { $startLine }–{ $endLine }.
    }
document-contains-errors = Iyi nyandiko irimo amakosa!
diagnostic-heading-error = Ikosa
diagnostic-heading-warning = Umuburo
diagnostic-heading-information = Amakuru
diagnostic-heading-hint = Inama
accessibility-heading-level-1 = Kutubahiriza Ukugerwaho kwa WCAG AA
accessibility-heading-level-2 = Umuburo w'ukugerwaho
something-went-wrong = Hari ikitagenze neza.
renderer-load-failed = igaragaza rimwe ntiryashoboye gupakirwa. Ongera upakire urupapuro.
core-start-failed = Igaragaza ry'inyandiko ntiryashoboye gutangira. Ongera upakire urupapuro.
