# Tachelhit viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# **Every counted message here writes three branches**, because
# `Intl.PluralRules("shi")` reports `one`, `few` and `other`; see
# `content.ftl`'s header. The `[0]` branch in `attempts-remaining` is matched
# by number rather than by category and sits ahead of them.
#
# `WCAG`, `WCAG AA` and `DoenetML` are names and stay in Latin letters, as do
# the digits.


## Answer submission

answer-checking = ⴰⵙⵏⵇⴷ…
answer-submitting = ⵜⵓⵣⵏⴰ…
answer-checking-status = ⵜⵉⵔⵉⵔⵉⵜ ⵜⵜⵓⵙⵏⵇⴰⴷ
answer-submitting-status = ⵜⵉⵔⵉⵔⵉⵜ ⵜⵜⵓⵣⵏ
answer-correct = ⴷ ⵜⵉⴷⵜ
answer-incorrect = ⵓⵔ ⴷ ⵜⵉⴷⵜ
answer-response-saved = ⵜⵉⵔⵉⵔⵉⵜ ⵜⵜⵓⵃⴹⴰ
answer-percent-credit = { $percent }% ⵏ ⵜⵏⵇⵉⴹⵉⵏ
answer-percent-correct = { $percent }% ⴷ ⵜⵉⴷⵜ
answer-percent-short = { $percent } %
max-credit-available = ⵜⵉⵏⵇⵉⴹⵉⵏ ⵓⴳⴳⴰⵔ ⵍⵍⴰⵏⵉⵏ: { $percent }%
attempts-remaining =
    { $count ->
        [0] ⵓⵔ ⵉⵍⵍⵉ ⵓⵄⵔⴰⴹ ⵉⵇⵇⵉⵎⵏ
        [one] ⵉⵇⵇⵉⵎ { $count } ⵏ ⵓⵄⵔⴰⴹ
        [few] ⵇⵇⵉⵎⵏ { $count } ⵏ ⵢⵉⵄⵔⴰⴹⵏ
       *[other] ⵇⵇⵉⵎⵏ { $count } ⵏ ⵢⵉⵄⵔⴰⴹⵏ
    }
validation-correct = (ⴷ ⵜⵉⴷⵜ)
validation-incorrect = (ⵓⵔ ⴷ ⵜⵉⴷⵜ)
validation-partially-correct = (ⴷ ⵜⵉⴷⵜ ⵙ ⵓⵃⵔⵉⵛ)
answer-show-responses =
    { $count ->
        [one] ⵎⵍ { $count } ⵏ ⵜⵔⵉⵔⵉⵜ ⵉ { $answerId }
        [few] ⵎⵍ { $count } ⵏ ⵜⵔⵉⵔⵉⵢⵉⵏ ⵉ { $answerId }
       *[other] ⵎⵍ { $count } ⵏ ⵜⵔⵉⵔⵉⵢⵉⵏ ⵉ { $answerId }
    }

## Disclosure panels

feedback-heading = ⵉⵡⵏⵏⵉⵜⵏ
collapsible-click-to-open = (ⵙⵉⵜ ⴰⴼⴰⴷ ⴰⴷ ⵜⵔⵣⵎⵜ)
collapsible-click-to-close = (ⵙⵉⵜ ⴰⴼⴰⴷ ⴰⴷ ⵜⵇⵇⵏⵜ)
collapsible-initializing = ⴰⵙⵏⴽⵔ…
footnote-show = ⵎⵍ ⵜⴰⵣⵎⵉⵍⵜ ⵏ ⵡⴰⴷⴷⴰ
footnote-hide = ⵃⴹⵓ ⵜⴰⵣⵎⵉⵍⵜ ⵏ ⵡⴰⴷⴷⴰ
description-more-information = ⵓⴳⴳⴰⵔ ⵏ ⵜⵍⵖⵓⵜ

## Controls

slider-previous = ⴰⵣⵡⵉⵔ
slider-next = ⴰⴹⴼⵉⵔ
keyboard-open = ⵔⵣⵎ ⴰⵏⴰⵙⵉⵡ
keyboard-close = ⵇⵇⵏ ⴰⵏⴰⵙⵉⵡ
choice-input-remove-choice = ⴽⴽⵙ { $choice }
matrix-remove-row = ⴽⴽⵙ ⵉⵣⵉⵔⵉⴳ
matrix-add-row = ⵔⵏⵓ ⵉⵣⵉⵔⵉⴳ
matrix-remove-column = ⴽⴽⵙ ⵜⴰⴳⵊⴷⵉⵜ
matrix-add-column = ⵔⵏⵓ ⵜⴰⴳⵊⴷⵉⵜ
subset-add-remove-points = ⵔⵏⵓ/ⴽⴽⵙ ⵜⵉⵏⵇⵉⴹⵉⵏ
subset-toggle-points-intervals = ⵙⵏⴼⵍ ⵜⵉⵏⵇⵉⴹⵉⵏ ⴷ ⵡⴰⴽⵓⴷⵏ
subset-move-points = ⵙⵎⵓⵜⵜⵉ ⵜⵉⵏⵇⵉⴹⵉⵏ
subset-clear = ⵙⴼⴹ
orbital-add-row = ⵔⵏⵓ ⵉⵣⵉⵔⵉⴳ
orbital-remove-row = ⴽⴽⵙ ⵉⵣⵉⵔⵉⴳ
orbital-add-box = ⵔⵏⵓ ⵜⴰⵏⴰⴽⴰ
orbital-remove-box = ⴽⴽⵙ ⵜⴰⵏⴰⴽⴰ
orbital-add-up-arrow = ⵔⵏⵓ ⵜⴰⵏⵛⵛⴰⴱⵜ ⵙ ⵓⴼⵍⵍⴰ
orbital-add-down-arrow = ⵔⵏⵓ ⵜⴰⵏⵛⵛⴰⴱⵜ ⵙ ⵡⴰⴷⴷⴰ
orbital-remove-arrow = ⴽⴽⵙ ⵜⴰⵏⵛⵛⴰⴱⵜ
orbital-row-label = ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵢⵉⵣⵉⵔⵉⴳ { $row }
pretzel-answer = ⵜⵉⵔⵉⵔⵉⵜ

## Math input

math-input-preview-region = ⵜⴰⵎⵓⵖⵍⵉ ⵜⴰⵣⵡⴰⵔⴰⵏⵜ ⵏ ⵜⵏⴼⴰⵍⵉⵜ ⵜⵓⵙⵏⴰⴽⵜ
math-input-preview = ⵜⴰⵎⵓⵖⵍⵉ ⵜⴰⵣⵡⴰⵔⴰⵏⵜ
math-input-invalid-expression = ⵜⴰⵏⴼⴰⵍⵉⵜ ⵜⴰⵔⴰⵎⵖⵜⵓⵜ:

## Document status

viewer-initializing = ⴰⵙⵏⴽⵔ…

## Errors

error-heading = ⵜⴰⵣⴳⴰⵍⵜ
error-found-at =
    { $span ->
        [line] ⵜⵜⵓⴼ ⴳ ⵢⵉⵣⵉⵔⵉⴳ { $startLine }.
       *[lines] ⵜⵜⵓⴼ ⴳ ⵢⵉⵣⵉⵔⵉⴳⵏ { $startLine }–{ $endLine }.
    }
document-contains-errors = ⴰⵙⵎⵍⵉ ⴰⴷ ⵉⵍⴰ ⵜⵉⵣⴳⴰⵍ!
diagnostic-heading-error = ⵜⴰⵣⴳⴰⵍⵜ
diagnostic-heading-warning = ⴰⵍⵖⵓ
diagnostic-heading-information = ⵜⴰⵍⵖⵓⵜ
diagnostic-heading-hint = ⵜⴰⵏⵖⵔⵓⴼⵜ
accessibility-heading-level-1 = ⴰⵣⴳⴰⵔ WCAG AA ⵏ ⵡⴰⵏⴽⵛⵓⵎ
accessibility-heading-level-2 = ⴰⵍⵖⵓ ⵏ ⵡⴰⵏⴽⵛⵓⵎ
something-went-wrong = ⵉⵍⵍⴰ ⵎⴰ ⵓⵔ ⵉⴷⴷⵉⵏ ⵙ ⵓⵣⴳⴰⵍ.
renderer-load-failed = ⴰⵎⵙⴽⵏ ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵢⴰⵍⵉ. ⵎⴽ ⵜⵔⵉⴷ ⵙⵎⴰⵢⵏⵓ ⴰⵙⴰⵜⵓ.
core-start-failed = ⴰⵎⵙⴽⵏ ⵏ ⵓⵙⵎⵍⵉ ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⴱⴷⵓ. ⵎⴽ ⵜⵔⵉⴷ ⵙⵎⴰⵢⵏⵓ ⴰⵙⴰⵜⵓ.
