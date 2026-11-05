# Sicilian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# CLDR gives Sicilian three plural categories, but the third is not a count a
# message here can reach: `many` selects only for a large round number written
# in compact notation, which nothing in these catalogs formats. So every
# `{ $count -> … }` below writes `one` and `*[other]`, and a `many` that ever
# does arrive falls to the default, which is the form it wants.
#
# `one` does not catch zero, so the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Cuntrullannu…
answer-submitting = Mannannu…
answer-checking-status = Cuntrollu dâ risposta
answer-submitting-status = Mannata dâ risposta
answer-correct = Giustu
answer-incorrect = Sbagghiatu
answer-response-saved = Risposta sarvata
answer-percent-credit = { $percent }% di punti
answer-percent-correct = { $percent }% giustu
answer-percent-short = { $percent } %
max-credit-available = Punti màssimi dispunìbbili: { $percent }%
attempts-remaining =
    { $count ->
        [0] nun ci sunnu chiù provi
        [one] resta { $count } prova
       *[other] rèstanu { $count } provi
    }
validation-correct = (Giustu)
validation-incorrect = (Sbagghiatu)
validation-partially-correct = (In parti giustu)
answer-show-responses =
    { $count ->
        [one] Ammustra { $count } risposta a { $answerId }
       *[other] Ammustra { $count } risposti a { $answerId }
    }

## Disclosure panels

feedback-heading = Cummentu
collapsible-click-to-open = (clicca pi grapiri)
collapsible-click-to-close = (clicca pi chiuiri)
collapsible-initializing = Aviannu…
footnote-show = Ammustra a nota
footnote-hide = Ammuccia a nota
description-more-information = chiù nfurmazzioni

## Controls

slider-previous = Precedenti
slider-next = Successivu
keyboard-open = Grapi a tastera
keyboard-close = Chiui a tastera
choice-input-remove-choice = Leva { $choice }
matrix-remove-row = Leva na riga
matrix-add-row = Junci na riga
matrix-remove-column = Leva na culonna
matrix-add-column = Junci na culonna
subset-add-remove-points = Junci/leva punti
subset-toggle-points-intervals = Cancia tra punti e ntervalli
subset-move-points = Movi i punti
subset-clear = Puliddìa
orbital-add-row = Junci na riga
orbital-remove-row = Leva na riga
orbital-add-box = Junci na casella
orbital-remove-box = Leva na casella
orbital-add-up-arrow = Junci na frizza versu supra
orbital-add-down-arrow = Junci na frizza versu sutta
orbital-remove-arrow = Leva na frizza
orbital-row-label = Etichetta dâ riga { $row }
pretzel-answer = Risposta

## Math input

math-input-preview-region = antiprima dâ sprissioni matimàtica
math-input-preview = Antiprima
math-input-invalid-expression = Sprissioni non vàlida:

## Document status

viewer-initializing = Aviannu…

## Errors

error-heading = Erruri
error-found-at =
    { $span ->
        [line] Attruvatu ntâ riga { $startLine }.
       *[lines] Attruvatu ntê righi { $startLine }–{ $endLine }.
    }
document-contains-errors = Stu ducumentu cunteni erruri!
diagnostic-heading-error = Erruri
diagnostic-heading-warning = Avvisu
diagnostic-heading-information = Nfurmazzioni
diagnostic-heading-hint = Suggerimentu
accessibility-heading-level-1 = Viulazzioni di l'accissibbilità secunnu WCAG AA
accessibility-heading-level-2 = Avvisu d'accissibbilità
something-went-wrong = Quarchi cosa jiu mali.
renderer-load-failed = un mòdulu di visualizzazzioni nun si carricau. Càrrica arrè a pàggina.
core-start-failed = U visualizzaturi dû ducumentu nun si potti aviari. Càrrica arrè a pàggina.
