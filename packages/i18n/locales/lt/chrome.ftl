# Lithuanian viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lithuanian counts in three categories a whole number can reach — `one`, `few`
# and `other` — so every `{ $count -> … }` below that prints its number has
# three branches where English has two. `one` is any number ending in 1 except
# the teens, `few` any ending in 2 to 9 except the teens, and `other` catches
# the teens, the round tens and zero, all of which take the genitive plural
# («10 bandymų»). CLDR's fourth category, `many`, is for fractions only and
# nothing here can reach it.
#
# Register: the second-person plural imperative — «Įkelkite puslapį iš naujo».


## Answer submission

answer-checking = Tikrinama…
answer-submitting = Pateikiama…
answer-checking-status = Atsakymo tikrinimas
answer-submitting-status = Atsakymo pateikimas
answer-correct = Teisinga
answer-incorrect = Neteisinga
answer-response-saved = Atsakymas įrašytas
answer-percent-credit = { $percent }% balo
answer-percent-correct = { $percent }% teisinga
answer-percent-short = { $percent } %
max-credit-available = Didžiausias galimas balas: { $percent }%
attempts-remaining =
    { $count ->
        [0] bandymų nebeliko
        [one] liko { $count } bandymas
        [few] liko { $count } bandymai
       *[other] liko { $count } bandymų
    }
validation-correct = (Teisinga)
validation-incorrect = (Neteisinga)
validation-partially-correct = (Iš dalies teisinga)
answer-show-responses =
    { $count ->
        [one] Rodyti { $count } atsakymą į { $answerId }
        [few] Rodyti { $count } atsakymus į { $answerId }
       *[other] Rodyti { $count } atsakymų į { $answerId }
    }

## Disclosure panels

feedback-heading = Grįžtamasis ryšys
collapsible-click-to-open = (spustelėkite, kad atvertumėte)
collapsible-click-to-close = (spustelėkite, kad užvertumėte)
collapsible-initializing = Paruošiama…
footnote-show = Rodyti išnašą
footnote-hide = Slėpti išnašą
description-more-information = daugiau informacijos

## Controls

slider-previous = Atgal
slider-next = Pirmyn
keyboard-open = Atverti klaviatūrą
keyboard-close = Užverti klaviatūrą
choice-input-remove-choice = Pašalinti { $choice }
matrix-remove-row = Pašalinti eilutę
matrix-add-row = Pridėti eilutę
matrix-remove-column = Pašalinti stulpelį
matrix-add-column = Pridėti stulpelį
subset-add-remove-points = Pridėti / pašalinti taškus
subset-toggle-points-intervals = Perjungti tarp taškų ir intervalų
subset-move-points = Perkelti taškus
subset-clear = Išvalyti
orbital-add-row = Pridėti eilutę
orbital-remove-row = Pašalinti eilutę
orbital-add-box = Pridėti langelį
orbital-remove-box = Pašalinti langelį
orbital-add-up-arrow = Pridėti rodyklę aukštyn
orbital-add-down-arrow = Pridėti rodyklę žemyn
orbital-remove-arrow = Pašalinti rodyklę
orbital-row-label = { $row } eilutės žymė
pretzel-answer = Atsakymas

## Math input

math-input-preview-region = matematinės išraiškos peržiūra
math-input-preview = Peržiūra
math-input-invalid-expression = Netinkama išraiška:

## Document status

viewer-initializing = Paruošiama…

## Errors

error-heading = Klaida
error-found-at =
    { $span ->
        [line] Rasta { $startLine } eilutėje.
       *[lines] Rasta { $startLine }–{ $endLine } eilutėse.
    }
document-contains-errors = Šiame dokumente yra klaidų!
diagnostic-heading-error = Klaida
diagnostic-heading-warning = Įspėjimas
diagnostic-heading-information = Informacija
diagnostic-heading-hint = Užuomina
accessibility-heading-level-1 = WCAG AA prieinamumo pažeidimas
accessibility-heading-level-2 = Prieinamumo pranešimas
something-went-wrong = Kažkas nepavyko.
renderer-load-failed = nepavyko įkelti atvaizdavimo modulio. Įkelkite puslapį iš naujo.
core-start-failed = Nepavyko paleisti dokumento peržiūros. Įkelkite puslapį iš naujo.
