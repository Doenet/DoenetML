# Gujarati viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the તમે imperative Gujarati puts on a button — «કીબોર્ડ
# ખોલો» — which is what a reader expects from software.
#
# Gujarati counts in two plural categories and marks the plural on the noun, so
# both are written out where the noun changes.
#
# Numbers render in Latin digits rather than in Gujarati numerals, which is the
# digit policy in the package README (#1615).


## Answer submission

answer-checking = તપાસી રહ્યાં છીએ...
answer-submitting = મોકલી રહ્યાં છીએ...
answer-checking-status = જવાબ તપાસાઈ રહ્યો છે
answer-submitting-status = જવાબ મોકલાઈ રહ્યો છે
answer-correct = સાચું
answer-incorrect = ખોટું
answer-response-saved = જવાબ સાચવ્યો
answer-percent-credit = { $percent }% ગુણ
answer-percent-correct = { $percent }% સાચું
answer-percent-short = { $percent }%
max-credit-available = ઉપલબ્ધ મહત્તમ ગુણ: { $percent }%
attempts-remaining =
    { $count ->
        [0] એકેય પ્રયાસ બાકી નથી
        [one] { $count } પ્રયાસ બાકી
       *[other] { $count } પ્રયાસો બાકી
    }
validation-correct = (સાચું)
validation-incorrect = (ખોટું)
validation-partially-correct = (અંશતઃ સાચું)
answer-show-responses =
    { $count ->
        [one] { $answerId } નો { $count } જવાબ બતાવો
       *[other] { $answerId } ના { $count } જવાબો બતાવો
    }

## Disclosure panels

feedback-heading = પ્રતિભાવ
collapsible-click-to-open = (ખોલવા ક્લિક કરો)
collapsible-click-to-close = (બંધ કરવા ક્લિક કરો)
collapsible-initializing = શરૂ થઈ રહ્યું છે...
footnote-show = પાદનોંધ બતાવો
footnote-hide = પાદનોંધ છુપાવો
description-more-information = વધુ માહિતી

## Controls

slider-previous = પાછલું
slider-next = આગલું
keyboard-open = કીબોર્ડ ખોલો
keyboard-close = કીબોર્ડ બંધ કરો
choice-input-remove-choice = { $choice } દૂર કરો
matrix-remove-row = હરોળ દૂર કરો
matrix-add-row = હરોળ ઉમેરો
matrix-remove-column = સ્તંભ દૂર કરો
matrix-add-column = સ્તંભ ઉમેરો
subset-add-remove-points = બિંદુઓ ઉમેરો/દૂર કરો
subset-toggle-points-intervals = બિંદુઓ અને અંતરાલો વચ્ચે બદલો
subset-move-points = બિંદુઓ ખસેડો
subset-clear = ભૂંસો
# A `box` here is one orbital, drawn as a square: ખાનું.
orbital-add-row = હરોળ ઉમેરો
orbital-remove-row = હરોળ દૂર કરો
orbital-add-box = ખાનું ઉમેરો
orbital-remove-box = ખાનું દૂર કરો
orbital-add-up-arrow = ઉપરનું તીર ઉમેરો
orbital-add-down-arrow = નીચેનું તીર ઉમેરો
orbital-remove-arrow = તીર દૂર કરો
orbital-row-label = હરોળ { $row } નું લેબલ
pretzel-answer = જવાબ

## Math input

math-input-preview-region = ગાણિતિક પદાવલિની ઝલક
math-input-preview = ઝલક
math-input-invalid-expression = અમાન્ય પદાવલિ:

## Document status

viewer-initializing = શરૂ થઈ રહ્યું છે...

## Errors

error-heading = ભૂલ
error-found-at =
    { $span ->
        [line] લીટી { $startLine } પર મળી.
       *[lines] લીટી { $startLine }–{ $endLine } પર મળી.
    }
document-contains-errors = આ દસ્તાવેજમાં ભૂલો છે!
diagnostic-heading-error = ભૂલ
diagnostic-heading-warning = ચેતવણી
diagnostic-heading-information = માહિતી
diagnostic-heading-hint = સંકેત
accessibility-heading-level-1 = WCAG AA સુગમતા ઉલ્લંઘન
accessibility-heading-level-2 = સુગમતા ચેતવણી
something-went-wrong = કંઈક ખોટું થયું.
renderer-load-failed = એક રેન્ડરર લોડ થઈ શક્યું નહીં. કૃપા કરી પાનું ફરી લોડ કરો.
core-start-failed = દસ્તાવેજ દર્શક શરૂ થઈ શક્યું નહીં. કૃપા કરી પાનું ફરી લોડ કરો.
