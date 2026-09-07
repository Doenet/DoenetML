# Dagbani viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the suffixed class concord, for what it shares
# with `locales/mos` and where the two differ, and for what a speaker should
# check first.


## Answer submission

answer-checking = Yuligu…
answer-submitting = Timbu…
answer-checking-status = Bɛ yuli lahabali maa
answer-submitting-status = Bɛ tim lahabali maa
answer-correct = Di viɛla
answer-incorrect = Di bi viɛla
answer-response-saved = Bɛ gbibi lahabali maa
answer-percent-credit = { $percent }% pɔyintnima
answer-percent-correct = { $percent }% viɛla
answer-percent-short = { $percent } %
max-credit-available = Pɔyint pam din be: { $percent }%
attempts-remaining =
    { $count ->
        [0] dihibu shɛli bi kpalim
        [one] dihibu { $count } n-kpalim
       *[other] dihibu { $count } n-kpalim
    }
validation-correct = (Di viɛla)
validation-incorrect = (Di bi viɛla)
validation-partially-correct = (Di viɛla pirigili)
answer-show-responses =
    { $count ->
        [one] Wuhi lahabali { $count } din chaŋ { $answerId }
       *[other] Wuhi lahabali { $count } din chaŋ { $answerId }
    }

## Disclosure panels

feedback-heading = Labsibu
collapsible-click-to-open = (nyɛbi ka yooi)
collapsible-click-to-close = (nyɛbi ka yɔhi)
collapsible-initializing = Piligu…
footnote-show = Wuhi tiŋgbani gbaabu
footnote-hide = Sɔɣi tiŋgbani gbaabu
description-more-information = lahabali shɛŋa

## Controls

slider-previous = Din daŋ
slider-next = Din pahi
keyboard-open = Yooi Kiiboodi
keyboard-close = Yɔhi Kiiboodi
choice-input-remove-choice = Yihi { $choice }
matrix-remove-row = Yihi layin
matrix-add-row = Pahi layin
matrix-remove-column = Yihi kɔlum
matrix-add-column = Pahi kɔlum
subset-add-remove-points = Pahi/Yihi pɔyintnima
subset-toggle-points-intervals = Taɣi pɔyintnima ni pirigilinima
subset-move-points = Vuui Pɔyintnima
subset-clear = Yihi zaa
orbital-add-row = Pahi Layin
orbital-remove-row = Yihi Layin
orbital-add-box = Pahi Adaka
orbital-remove-box = Yihi Adaka
orbital-add-up-arrow = Pahi Pima Din Chaŋ Zuɣu
orbital-add-down-arrow = Pahi Pima Din Chaŋ Tiŋgbani
orbital-remove-arrow = Yihi Pima
orbital-row-label = Layin { $row } yuli
pretzel-answer = Lahabali

## Math input

math-input-preview-region = kalinli yɛtɔɣa nyabu pɔi
math-input-preview = Nyabu pɔi
math-input-invalid-expression = Yɛtɔɣa din bi tuhi:

## Document status

viewer-initializing = Piligu…

## Errors

error-heading = Taali
error-found-at =
    { $span ->
        [line] Bɛ nya li layin { $startLine } zuɣu.
       *[lines] Bɛ nya li layinnima { $startLine }–{ $endLine } zuɣu.
    }
document-contains-errors = Gbaŋ ŋɔ mali taya!
diagnostic-heading-error = Taali
diagnostic-heading-warning = Kpahimbu
diagnostic-heading-information = Lahabali
diagnostic-heading-hint = Maka
accessibility-heading-level-1 = WCAG AA paabu taali
accessibility-heading-level-2 = Paabu kpahimbu
something-went-wrong = Shɛli bi niŋ viɛnyɛla.
renderer-load-failed = wuhira bi kana. Din niŋ suhudoo, labsim peji maa.
core-start-failed = Gbaŋ wuhira bi pili. Din niŋ suhudoo, labsim peji maa.
