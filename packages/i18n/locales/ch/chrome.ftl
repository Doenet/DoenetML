# Chamorro viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Guam orthography (Kumisión i Fino' CHamoru), which writes the
# glottal stop as «'» and the low vowel as «å». The Northern Marianas spell some
# of the same words differently, and a deployment that wants the CNMI standard
# supplies its own catalog as `localeResources`; correcting this file word by
# word toward it is what would leave the locale in two orthographies at once.
#
# Chamorro marks no number on the noun — «siha» after it is the plural, and a
# numeral does not take it — so a `{ $count -> … }` whose two English branches
# differ only in the noun renders one string here and the select is dropped. A
# `[0]` branch stays wherever English has one.


## Answer submission

answer-checking = Machecheki…
answer-submitting = Manmanenå'i…
answer-checking-status = Machecheki i ineppe'
answer-submitting-status = Manmanenå'i i ineppe'
answer-correct = Korekto
answer-incorrect = Ti korekto
answer-response-saved = Masåtba i ineppe'
answer-percent-credit = { $percent }% na kredito
answer-percent-correct = { $percent }% korekto
answer-percent-short = { $percent } %
max-credit-available = I mås takhilo' na kredito ni siña masodda': { $percent }%
# No select: «chinagi» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] taya' mås chinagi ni sesetbe
       *[other] { $count } na chinagi sesetbe ha'
    }
validation-correct = (Korekto)
validation-incorrect = (Ti korekto)
validation-partially-correct = (Korekto gi patte)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Na'annok { $count } na ineppe' para i { $answerId }

## Disclosure panels

feedback-heading = Kumentåyu
collapsible-click-to-open = (klek para u mababa)
collapsible-click-to-close = (klek para u mahuchom)
collapsible-initializing = Matutuhon…
footnote-show = Na'annok i footnote
footnote-hide = Na'atok i footnote
description-more-information = mås infotmasion

## Controls

slider-previous = Antes
slider-next = Sigiente
keyboard-open = Baba i tekladu
keyboard-close = Huchom i tekladu
choice-input-remove-choice = Na'suha i { $choice }
matrix-remove-row = Na'suha i liña
matrix-add-row = Na'saga un liña
matrix-remove-column = Na'suha i kolumna
matrix-add-column = Na'saga un kolumna
subset-add-remove-points = Na'saga/Na'suha puntos
subset-toggle-points-intervals = Tulaika puntos yan intetbalu
subset-move-points = Na'mudda i puntos
subset-clear = Na'gasgas
orbital-add-row = Na'saga un liña
orbital-remove-row = Na'suha i liña
orbital-add-box = Na'saga un kahon
orbital-remove-box = Na'suha i kahon
orbital-add-up-arrow = Na'saga un flecha hulo'
orbital-add-down-arrow = Na'saga un flecha papa'
orbital-remove-arrow = Na'suha i flecha
orbital-row-label = Etiketa para i liña { $row }
pretzel-answer = Ineppe'

## Math input

math-input-preview-region = fine'nana na atan i ekspresion matemåtika
math-input-preview = Fine'nana na atan
math-input-invalid-expression = Ti maolek na ekspresion:

## Document status

viewer-initializing = Matutuhon…

## Errors

error-heading = Linachi
error-found-at =
    { $span ->
        [line] Masodda' gi liña { $startLine }.
       *[lines] Masodda' gi liña { $startLine }–{ $endLine }.
    }
document-contains-errors = Guaha linachi este na dokumento!
diagnostic-heading-error = Linachi
diagnostic-heading-warning = Adbertensia
diagnostic-heading-information = Infotmasion
diagnostic-heading-hint = Hinasso
accessibility-heading-level-1 = Kinentra i akseso WCAG AA
accessibility-heading-level-2 = Adbertensia put i akseso
something-went-wrong = Guaha ti maolek.
renderer-load-failed = guaha renderer ni ti masetbe. Pot fabot na'nuebu i påhina.
core-start-failed = Ti siña matutuhon i atan i dokumento. Pot fabot na'nuebu i påhina.
