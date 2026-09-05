# Tiv viewer chrome: buttons, panel headers, and other UI the reader interacts
# with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the relative particle that carries the noun
# class — the third place agreement is spelled in these catalogs — and for what
# a speaker should check first.


## Answer submission

answer-checking = I ngu tôôn…
answer-submitting = I ngu tindin…
answer-checking-status = I ngu tôôn mlumun la
answer-submitting-status = I ngu tindin mlumun la
answer-correct = Ka mimi
answer-incorrect = Ka mimi ga
answer-response-saved = I Kura Mlumun la
answer-percent-credit = { $percent }% mba upoyint
answer-percent-correct = { $percent }% mimi
answer-percent-short = { $percent } %
max-credit-available = Upoyint mba kpishi mba ve lu: { $percent }%
attempts-remaining =
    { $count ->
        [0] mtsen ma shi ga
        [one] mtsen { $count } u shi
       *[other] amtsen { $count } a shi
    }
validation-correct = (Ka mimi)
validation-incorrect = (Ka mimi ga)
validation-partially-correct = (Ka mimi sha ikyar igen)
answer-show-responses =
    { $count ->
        [one] Tese mlumun { $count } u { $answerId }
       *[other] Tese amlumun { $count } a { $answerId }
    }

## Disclosure panels

feedback-heading = Mkaanem
collapsible-click-to-open = (nyanger u bughun)
collapsible-click-to-close = (nyanger u kuran)
collapsible-initializing = I ngu hiin…
footnote-show = Tese mngerem ma sha inya
footnote-hide = Yer mngerem ma sha inya
description-more-information = akaa agen

## Controls

slider-previous = U karen
slider-next = U dondon
keyboard-open = Bugh Kiiboodu
keyboard-close = Kur Kiiboodu
choice-input-remove-choice = Dugh { $choice }
matrix-remove-row = Dugh layin
matrix-add-row = Seer layin
matrix-remove-column = Dugh kolum
matrix-add-column = Seer kolum
subset-add-remove-points = Seer/Dugh upoyint
subset-toggle-points-intervals = Gema upoyint man akyar
subset-move-points = Mough Upoyint
subset-clear = Dugh cii
orbital-add-row = Seer Layin
orbital-remove-row = Dugh Layin
orbital-add-box = Seer Ikpe
orbital-remove-box = Dugh Ikpe
orbital-add-up-arrow = Seer Ityôgh i Sha
orbital-add-down-arrow = Seer Ityôgh i Inya
orbital-remove-arrow = Dugh Ityôgh
orbital-row-label = Iti i layin { $row }
pretzel-answer = Mlumun

## Math input

math-input-preview-region = mnenge u hiihii u akaa a mbamsen
math-input-preview = Mnenge u hiihii
math-input-invalid-expression = Mkaanem ma ma doo ga:

## Document status

viewer-initializing = I ngu hiin…

## Errors

error-heading = Mtev
error-found-at =
    { $span ->
        [line] I zua a mi sha layin { $startLine }.
       *[lines] I zua a mi sha ulayin { $startLine }–{ $endLine }.
    }
document-contains-errors = Takerada ne ngu a mtev!
diagnostic-heading-error = Mtev
diagnostic-heading-warning = Mtaver
diagnostic-heading-information = Kwaghôron
diagnostic-heading-hint = Mtesen
accessibility-heading-level-1 = Mkar u WCAG AA u mzough
accessibility-heading-level-2 = Mtaver u mzough
something-went-wrong = Kwagh ugen er dedoo ga.
renderer-load-failed = ortesen va ga. Er sar we yô, hide a peji la.
core-start-failed = Ortesen u takerada hii ga. Er sar we yô, hide a peji la.
