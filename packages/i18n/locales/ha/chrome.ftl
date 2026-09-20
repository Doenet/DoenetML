# Hausa viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Hausa counts in two plural categories, but a noun after a numeral stays
# singular — «yunƙuri 5», never «yunƙure-yunƙure 5» — so a `{ $count }` message
# reads the same in both branches and the select is dropped rather than written
# out twice identically. `[other]` then catches every count. `[0]` is still
# spelled out where the English wording changes for zero, because that is a
# different sentence rather than a different number.


## Answer submission

answer-checking = Ana dubawa...
answer-submitting = Ana aikawa...
answer-checking-status = Ana duba amsa
answer-submitting-status = Ana aika amsa
answer-correct = Daidai
answer-incorrect = Ba daidai ba
answer-response-saved = An Ajiye Amsa
answer-percent-credit = Maki { $percent }%
answer-percent-correct = { $percent }% Daidai
answer-percent-short = { $percent }%
max-credit-available = Mafi girman maki da ake iya samu: { $percent }%
attempts-remaining =
    { $count ->
        [0] babu sauran yunƙuri
       *[other] sauran yunƙuri { $count }
    }
validation-correct = (Daidai)
validation-incorrect = (Ba daidai ba)
validation-partially-correct = (Daidai a wani ɓangare)
answer-show-responses = Nuna amsa { $count } ga { $answerId }

## Disclosure panels

feedback-heading = Ra'ayi
collapsible-click-to-open = (danna don buɗewa)
collapsible-click-to-close = (danna don rufewa)
collapsible-initializing = Ana farawa...
footnote-show = Nuna bayanin ƙasa
footnote-hide = Ɓoye bayanin ƙasa
description-more-information = ƙarin bayani

## Controls

slider-previous = Baya
slider-next = Gaba
keyboard-open = Buɗe Madannai
keyboard-close = Rufe Madannai
choice-input-remove-choice = Cire { $choice }
matrix-remove-row = Cire jeri
matrix-add-row = Ƙara jeri
matrix-remove-column = Cire ginshiƙi
matrix-add-column = Ƙara ginshiƙi
subset-add-remove-points = Ƙara/Cire digo
subset-toggle-points-intervals = Sauya tsakanin digo da tazara
subset-move-points = Motsa Digo
subset-clear = Share
# A `box` here is one orbital, drawn as a square: akwati.
orbital-add-row = Ƙara Jeri
orbital-remove-row = Cire Jeri
orbital-add-box = Ƙara Akwati
orbital-remove-box = Cire Akwati
orbital-add-up-arrow = Ƙara Kibiya Sama
orbital-add-down-arrow = Ƙara Kibiya Ƙasa
orbital-remove-arrow = Cire Kibiya
orbital-row-label = Lakabin jeri { $row }
pretzel-answer = Amsa

## Math input

math-input-preview-region = duban bayanin lissafi
math-input-preview = Dubawa
math-input-invalid-expression = Bayani mara inganci:

## Document status

viewer-initializing = Ana farawa...

## Errors

error-heading = Kuskure
error-found-at =
    { $span ->
        [line] An same shi a layi { $startLine }.
       *[lines] An same shi a layuka { $startLine }–{ $endLine }.
    }
document-contains-errors = Wannan takarda tana da kurakurai!
diagnostic-heading-error = Kuskure
diagnostic-heading-warning = Gargaɗi
diagnostic-heading-information = Bayani
diagnostic-heading-hint = Alama
accessibility-heading-level-1 = Take Haƙƙin Samun Damar WCAG AA
accessibility-heading-level-2 = Gargaɗin samun dama
something-went-wrong = Wani abu bai tafi daidai ba.
renderer-load-failed = wani mai nunawa bai ɗauku ba. Da fatan za a sake ɗora shafin.
core-start-failed = Ba a iya fara mai nuna takardar ba. Da fatan za a sake ɗora shafin.
