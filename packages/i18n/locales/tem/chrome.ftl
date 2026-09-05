# Temne viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the alliterative-concord table, for why that
# makes `noun-gender` checkable against `noun` by eye, and for what a speaker
# should check first.


## Answer submission

answer-checking = Ɔ chɛk…
answer-submitting = Ɔ sɔŋ…
answer-checking-status = Ɔ chɛk ʌŋlipi
answer-submitting-status = Ɔ sɔŋ ʌŋlipi
answer-correct = Kʌ tɔfɔ
answer-incorrect = Kʌ tɔfɔ bɔm
answer-response-saved = Ʌŋlipi Ma Sɔŋɔ
answer-percent-credit = { $percent }% Kʌbay
answer-percent-correct = { $percent }% Tɔfɔ
answer-percent-short = { $percent } %
max-credit-available = Kʌbay kʌbana kʌ mʌ bata: { $percent }%
attempts-remaining =
    { $count ->
        [0] kʌtʌmpa kʌ bɔm
        [one] kʌtʌmpa { $count } kʌ dəni
       *[other] tʌtʌmpa { $count } tʌ dəni
    }
validation-correct = (Kʌ tɔfɔ)
validation-incorrect = (Kʌ tɔfɔ bɔm)
validation-partially-correct = (Kʌ tɔfɔ kʌpath)
answer-show-responses =
    { $count ->
        [one] Yira ʌŋlipi { $count } ka { $answerId }
       *[other] Yira ʌŋlipi { $count } ka { $answerId }
    }

## Disclosure panels

feedback-heading = Ʌŋlipi ka kʌkarante
collapsible-click-to-open = (tɔth ma kʌ tuli)
collapsible-click-to-close = (tɔth ma kʌ kanti)
collapsible-initializing = Kʌ təŋ…
footnote-show = Yira kʌsɔŋ kʌ kʌtəp
footnote-hide = Kunthu kʌsɔŋ kʌ kʌtəp
description-more-information = tʌkəre tʌbʌŋ

## Controls

slider-previous = Kʌ pʌ
slider-next = Kʌ tʌŋ
keyboard-open = Tuli Kibɔd
keyboard-close = Kanti Kibɔd
choice-input-remove-choice = Bɔth { $choice }
matrix-remove-row = Bɔth kʌro
matrix-add-row = Fɔth kʌro
matrix-remove-column = Bɔth kʌkɔlum
matrix-add-column = Fɔth kʌkɔlum
subset-add-remove-points = Fɔth/Bɔth tʌtoni
subset-toggle-points-intervals = Firi tʌtoni na tʌintaval
subset-move-points = Bʌŋ Tʌtoni
subset-clear = Sana
orbital-add-row = Fɔth Kʌro
orbital-remove-row = Bɔth Kʌro
orbital-add-box = Fɔth Kʌbɔks
orbital-remove-box = Bɔth Kʌbɔks
orbital-add-up-arrow = Fɔth Kʌaro Kʌ Kʌtɔŋ
orbital-add-down-arrow = Fɔth Kʌaro Kʌ Kʌtəp
orbital-remove-arrow = Bɔth Kʌaro
orbital-row-label = Ʌŋes ka kʌro { $row }
pretzel-answer = Ʌŋlipi

## Math input

math-input-preview-region = yira ʌŋkəre ka mat pʌ
math-input-preview = Yira pʌ
math-input-invalid-expression = Ʌŋkəre kʌ bana bɔm:

## Document status

viewer-initializing = Kʌ təŋ…

## Errors

error-heading = Kʌwuni
error-found-at =
    { $span ->
        [line] Ma bata ka kʌlayn { $startLine }.
       *[lines] Ma bata ka tʌlayn { $startLine }–{ $endLine }.
    }
document-contains-errors = Kʌbuk kʌnɛ kʌ na tʌwuni!
diagnostic-heading-error = Kʌwuni
diagnostic-heading-warning = Kʌmɔŋ
diagnostic-heading-information = Ʌŋkəre
diagnostic-heading-hint = Kʌsandi
accessibility-heading-level-1 = WCAG AA Kʌwuni ka Kʌsɔth
accessibility-heading-level-2 = Kʌmɔŋ ka kʌsɔth
something-went-wrong = Kʌbʌŋ kʌ bana bɔm.
renderer-load-failed = kʌyiraŋ kʌbʌŋ kʌ ba bɔm. Bɔŋɔ, firi kʌpej.
core-start-failed = Kʌyiraŋ ka kʌbuk kʌ təŋ bɔm. Bɔŋɔ, firi kʌpej.
