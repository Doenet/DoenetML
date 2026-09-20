# Standard Moroccan Tamazight viewer chrome: buttons, panel headers, and other
# UI the reader interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Written in Tifinagh; see `content.ftl`'s header for why the script is
# Tifinagh here and Latin in `locales/kab`, and for the gender fork.
#
# `WCAG`, `WCAG AA` and `DoenetML` are names and stay in Latin letters, as do
# the digits — see the number-formatting policy in the README.


## Answer submission

answer-checking = ⴰⵙⵏⵇⴻⴷ…
answer-submitting = ⵜⵓⵣⵏⴰ…
answer-checking-status = ⵜⵉⵔⵉⵔⵉⵜ ⵜⴻⵜⵜⵡⴰⵙⵏⵇⴰⴷ
answer-submitting-status = ⵜⵉⵔⵉⵔⵉⵜ ⵜⴻⵜⵜⵡⴰⵣⴻⵏ
answer-correct = ⴷ ⵜⵉⴷⴻⵜ
answer-incorrect = ⵎⴰⵛⵛⵉ ⴷ ⵜⵉⴷⴻⵜ
answer-response-saved = ⵜⵉⵔⵉⵔⵉⵜ ⵜⴻⵜⵜⵡⴰⵃⴹⴰ
answer-percent-credit = { $percent }% ⵏ ⵜⴻⵏⵇⵉⴹⵉⵏ
answer-percent-correct = { $percent }% ⴷ ⵜⵉⴷⴻⵜ
answer-percent-short = { $percent } %
max-credit-available = ⵜⵉⵏⵇⵉⴹⵉⵏ ⵓⴳⴰⵔ ⵉ ⵢⴻⵍⵍⴰⵏ: { $percent }%
attempts-remaining =
    { $count ->
        [0] ⵓⵍⴰⵛ ⴰⵄⵔⴰⴹ ⵉ ⴷ-ⵢⴻⵇⵇⵉⵎⴻⵏ
        [one] ⵢⴻⵇⵇⵉⵎ-ⴷ { $count } ⵏ ⵓⵄⵔⴰⴹ
       *[other] ⵇⵇⵉⵎⴻⵏ-ⴷ { $count } ⵏ ⵢⵉⵄⵔⴰⴹⴻⵏ
    }
validation-correct = (ⴷ ⵜⵉⴷⴻⵜ)
validation-incorrect = (ⵎⴰⵛⵛⵉ ⴷ ⵜⵉⴷⴻⵜ)
validation-partially-correct = (ⴷ ⵜⵉⴷⴻⵜ ⵙ ⵓⵃⵔⵉⵛ)
answer-show-responses =
    { $count ->
        [one] ⵙⴽⴻⵏ { $count } ⵏ ⵜⵔⵉⵔⵉⵜ ⵉ { $answerId }
       *[other] ⵙⴽⴻⵏ { $count } ⵏ ⵜⵔⵉⵔⵉⵢⵉⵏ ⵉ { $answerId }
    }

## Disclosure panels

feedback-heading = ⵉⵡⴻⵏⵏⵉⵜⴻⵏ
collapsible-click-to-open = (ⵙⵉⵜ ⴰⴽⴽⴻⵏ ⴰⴷ ⵜⴻⵍⴷⵉⴷ)
collapsible-click-to-close = (ⵙⵉⵜ ⴰⴽⴽⴻⵏ ⴰⴷ ⵜⵎⴻⴷⵍⴻⴷ)
collapsible-initializing = ⴰⵙⴻⵏⴽⴻⵔ…
footnote-show = ⵙⴽⴻⵏ ⵜⴰⵣⵎⵉⵍⵜ ⵏ ⵡⴰⴷⴷⴰ
footnote-hide = ⴼⴼⴻⵔ ⵜⴰⵣⵎⵉⵍⵜ ⵏ ⵡⴰⴷⴷⴰ
description-more-information = ⵓⴳⴰⵔ ⵏ ⵜⴻⵍⵖⵓⵜ

## Controls

slider-previous = ⴰⵣⵡⵉⵔ
slider-next = ⴰⴹⴼⵉⵔ
keyboard-open = ⵍⴷⵉ ⴰⵏⴰⵙⵉⵡ
keyboard-close = ⵎⴷⴻⵍ ⴰⵏⴰⵙⵉⵡ
choice-input-remove-choice = ⴽⴽⴻⵙ { $choice }
matrix-remove-row = ⴽⴽⴻⵙ ⵉⵣⵉⵔⵉⴳ
matrix-add-row = ⵔⵏⵓ ⵉⵣⵉⵔⵉⴳ
matrix-remove-column = ⴽⴽⴻⵙ ⵜⴰⴳⴻⵊⴷⵉⵜ
matrix-add-column = ⵔⵏⵓ ⵜⴰⴳⴻⵊⴷⵉⵜ
subset-add-remove-points = ⵔⵏⵓ/ⴽⴽⴻⵙ ⵜⵉⵏⵇⵉⴹⵉⵏ
subset-toggle-points-intervals = ⴱⴻⴷⴷⴻⵍ ⵜⵉⵏⵇⵉⴹⵉⵏ ⴷ ⵡⴰⴽⵓⴷⴻⵏ
subset-move-points = ⵙⵎⵓⵜⵜⵉ ⵜⵉⵏⵇⵉⴹⵉⵏ
subset-clear = ⵙⴼⴻⴹ
orbital-add-row = ⵔⵏⵓ ⵉⵣⵉⵔⵉⴳ
orbital-remove-row = ⴽⴽⴻⵙ ⵉⵣⵉⵔⵉⴳ
orbital-add-box = ⵔⵏⵓ ⵜⴰⵏⴰⴽⴰ
orbital-remove-box = ⴽⴽⴻⵙ ⵜⴰⵏⴰⴽⴰ
orbital-add-up-arrow = ⵔⵏⵓ ⵜⴰⵏⴻⵛⵛⴰⴱⵜ ⵙ ⵓⴼⴻⵍⵍⴰ
orbital-add-down-arrow = ⵔⵏⵓ ⵜⴰⵏⴻⵛⵛⴰⴱⵜ ⵙ ⵡⴰⴷⴷⴰ
orbital-remove-arrow = ⴽⴽⴻⵙ ⵜⴰⵏⴻⵛⵛⴰⴱⵜ
orbital-row-label = ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵢⵉⵣⵉⵔⵉⴳ { $row }
pretzel-answer = ⵜⵉⵔⵉⵔⵉⵜ

## Math input

math-input-preview-region = ⵜⴰⵎⵓⵖⵍⵉ ⵜⴰⵣⵡⴰⵔⴰⵏⵜ ⵏ ⵜⴻⵏⴼⴰⵍⵉⵜ ⵜⵓⵙⵏⴰⴽⵜ
math-input-preview = ⵜⴰⵎⵓⵖⵍⵉ ⵜⴰⵣⵡⴰⵔⴰⵏⵜ
math-input-invalid-expression = ⵜⴰⵏⴼⴰⵍⵉⵜ ⵜⴰⵔⴰⵎⴻⵖⵜⵓⵜ:

## Document status

viewer-initializing = ⴰⵙⴻⵏⴽⴻⵔ…

## Errors

error-heading = ⵜⵓⵛⵛⴹⴰ
error-found-at =
    { $span ->
        [line] ⵜⴻⵜⵜⵡⴰⴼ ⴷⴻⴳ ⵢⵉⵣⵉⵔⵉⴳ { $startLine }.
       *[lines] ⵜⴻⵜⵜⵡⴰⴼ ⴷⴻⴳ ⵢⵉⵣⵉⵔⵉⴳⴻⵏ { $startLine }–{ $endLine }.
    }
document-contains-errors = ⴰⵙⴻⵎⵍⵉ-ⴰ ⵢⴻⵙⵄⴰ ⵜⵓⵛⵛⴹⵉⵡⵉⵏ!
diagnostic-heading-error = ⵜⵓⵛⵛⴹⴰ
diagnostic-heading-warning = ⴰⵍⵖⵓ
diagnostic-heading-information = ⵜⴰⵍⵖⵓⵜ
diagnostic-heading-hint = ⵜⴰⵏⴻⵖⵔⵓⴼⵜ
accessibility-heading-level-1 = ⴰⵣⴳⴰⵔ WCAG AA ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ
accessibility-heading-level-2 = ⴰⵍⵖⵓ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ
something-went-wrong = ⵢⴻⵍⵍⴰ ⵡⴰⵢⴻⵏ ⵓⵔ ⵏⵜⴻⴷⴷⵓ ⴰⵔⴰ ⴰⴽⴽⴻⵏ ⵉⵡⴰⵜⴰ.
renderer-load-failed = ⴰⵎⵙⴽⴻⵏ ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⴷ-ⵢⴰⵍⵉ. ⵜⵜⵅⵉⵍ-ⴽ ⴰⵍⴻⵙ ⴰⵙⴰⵍⵉ ⵏ ⵓⵙⴻⴱⵜⴻⵔ.
core-start-failed = ⴰⵎⵙⴽⴻⵏ ⵏ ⵓⵙⴻⵎⵍⵉ ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴽⴽⴻⵔ. ⵜⵜⵅⵉⵍ-ⴽ ⴰⵍⴻⵙ ⴰⵙⴰⵍⵉ ⵏ ⵓⵙⴻⴱⵜⴻⵔ.
