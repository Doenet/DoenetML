# Kanuri viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the macrolanguage, for the Ajami script debt,
# and for what a speaker should check first.


## Answer submission

answer-checking = Kalakcin…
answer-submitting = Sadin…
answer-checking-status = Jawabga kalakcin
answer-submitting-status = Jawabga sadin
answer-correct = Haqqa
answer-incorrect = Haqqani
answer-response-saved = Jawab Ngǝwuna
answer-percent-credit = { $percent }% poyintwa
answer-percent-correct = { $percent }% haqqa
answer-percent-short = { $percent } %
max-credit-available = Poyintwa kura barwa: { $percent }%
attempts-remaining =
    { $count ->
        [0] karangi bago
        [one] karangi { $count } bar
       *[other] karangiwa { $count } bar
    }
validation-correct = (Haqqa)
validation-incorrect = (Haqqani)
validation-partially-correct = (Fartuben haqqa)
answer-show-responses =
    { $count ->
        [one] Jawab { $count } { $answerId }-be cirǝge
       *[other] Jawabwa { $count } { $answerId }-be cirǝge
    }

## Disclosure panels

feedback-heading = Kalamnzǝ
collapsible-click-to-open = (kilage kǝntǝge)
collapsible-click-to-close = (kilage tǝwuge)
collapsible-initializing = Jibin…
footnote-show = Alama kǝskabe cirǝge
footnote-hide = Alama kǝskabe ngǝwuge
description-more-information = kalamwa gade

## Controls

slider-previous = Ngǝwube
slider-next = Waube
keyboard-open = Kiboodga Kǝntǝge
keyboard-close = Kiboodga Tǝwuge
choice-input-remove-choice = { $choice } burge
matrix-remove-row = Layinga burge
matrix-add-row = Layinga zawuge
matrix-remove-column = Kolomga burge
matrix-add-column = Kolomga zawuge
subset-add-remove-points = Poyintwaga zawuge/burge
subset-toggle-points-intervals = Poyintwa be fartuwaga gǝrǝge
subset-move-points = Poyintwaga Jǝlage
subset-clear = Kambe burge
orbital-add-row = Layinga Zawuge
orbital-remove-row = Layinga Burge
orbital-add-box = Sanduqga Zawuge
orbital-remove-box = Sanduqga Burge
orbital-add-up-arrow = Kǝnyi Kǝlabega Zawuge
orbital-add-down-arrow = Kǝnyi Kǝskabega Zawuge
orbital-remove-arrow = Kǝnyiga Burge
orbital-row-label = Layin { $row }-be cin
pretzel-answer = Jawab

## Math input

math-input-preview-region = kǝlkǝl kalambe cirǝwu ngǝwube
math-input-preview = Cirǝwu ngǝwube
math-input-invalid-expression = Kalam ngǝlani:

## Document status

viewer-initializing = Jibin…

## Errors

error-heading = Karsa
error-found-at =
    { $span ->
        [line] Layin { $startLine }-ro rukcǝna.
       *[lines] Layinwa { $startLine }–{ $endLine }-ro rukcǝna.
    }
document-contains-errors = Kitabu adǝ karsawa jinzǝ!
diagnostic-heading-error = Karsa
diagnostic-heading-warning = Nyirtu
diagnostic-heading-information = Kalam
diagnostic-heading-hint = Alama
accessibility-heading-level-1 = WCAG AA jǝmbe karsa
accessibility-heading-level-2 = Jǝmbe nyirtu
something-went-wrong = Ndu gade ngǝlani.
renderer-load-failed = cirǝgema isǝni. Bilage, belaga gǝrǝge.
core-start-failed = Kitabu-be cirǝgema jibǝni. Bilage, belaga gǝrǝge.
