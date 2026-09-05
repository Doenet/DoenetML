# Estonian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Estonian counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. The
# noun after a number stands in the partitive singular — «2 katset», not a
# plural — so the `other` branch is one form rather than two.
#
# Register: the second-person plural imperative — «Laadige leht uuesti».


## Answer submission

answer-checking = Kontrollin…
answer-submitting = Saadan…
answer-checking-status = Vastuse kontrollimine
answer-submitting-status = Vastuse saatmine
answer-correct = Õige
answer-incorrect = Vale
answer-response-saved = Vastus salvestatud
answer-percent-credit = { $percent }% punktidest
answer-percent-correct = { $percent }% õige
answer-percent-short = { $percent } %
max-credit-available = Suurim võimalik punktisumma: { $percent }%
attempts-remaining =
    { $count ->
        [0] katseid pole enam
        [one] jäänud { $count } katse
       *[other] jäänud { $count } katset
    }
validation-correct = (Õige)
validation-incorrect = (Vale)
validation-partially-correct = (Osaliselt õige)
answer-show-responses =
    { $count ->
        [one] Näita { $count } vastust küsimusele { $answerId }
       *[other] Näita { $count } vastust küsimusele { $answerId }
    }

## Disclosure panels

feedback-heading = Tagasiside
collapsible-click-to-open = (klõpsake avamiseks)
collapsible-click-to-close = (klõpsake sulgemiseks)
collapsible-initializing = Käivitan…
footnote-show = Näita allmärkust
footnote-hide = Peida allmärkus
description-more-information = lisateave

## Controls

slider-previous = Tagasi
slider-next = Edasi
keyboard-open = Ava klaviatuur
keyboard-close = Sulge klaviatuur
choice-input-remove-choice = Eemalda { $choice }
matrix-remove-row = Eemalda rida
matrix-add-row = Lisa rida
matrix-remove-column = Eemalda veerg
matrix-add-column = Lisa veerg
subset-add-remove-points = Lisa/eemalda punkte
subset-toggle-points-intervals = Lülita punktide ja vahemike vahel
subset-move-points = Liiguta punkte
subset-clear = Tühjenda
orbital-add-row = Lisa rida
orbital-remove-row = Eemalda rida
orbital-add-box = Lisa kast
orbital-remove-box = Eemalda kast
orbital-add-up-arrow = Lisa nool üles
orbital-add-down-arrow = Lisa nool alla
orbital-remove-arrow = Eemalda nool
orbital-row-label = Rea { $row } silt
pretzel-answer = Vastus

## Math input

math-input-preview-region = matemaatilise avaldise eelvaade
math-input-preview = Eelvaade
math-input-invalid-expression = Vigane avaldis:

## Document status

viewer-initializing = Käivitan…

## Errors

error-heading = Viga
error-found-at =
    { $span ->
        [line] Leitud real { $startLine }.
       *[lines] Leitud ridadel { $startLine }–{ $endLine }.
    }
document-contains-errors = See dokument sisaldab vigu!
diagnostic-heading-error = Viga
diagnostic-heading-warning = Hoiatus
diagnostic-heading-information = Teave
diagnostic-heading-hint = Vihje
accessibility-heading-level-1 = WCAG AA ligipääsetavuse rikkumine
accessibility-heading-level-2 = Ligipääsetavuse teade
something-went-wrong = Midagi läks valesti.
renderer-load-failed = kuvamismoodulit ei õnnestunud laadida. Laadige leht uuesti.
core-start-failed = Dokumendivaaturit ei õnnestunud käivitada. Laadige leht uuesti.
