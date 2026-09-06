# Santali viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Written in Ol Chiki; see `content.ftl`'s header for the script note and for
# the dual. Both counted messages below write a `[two]` branch, and the noun in
# it takes the dual suffix -ᱠᱤᱱ where the `[other]` branch takes -ᱠᱚ.


## Answer submission

answer-checking = ᱧᱮᱞ ᱠᱟᱱᱟ…
answer-submitting = ᱠᱩᱞ ᱠᱟᱱᱟ…
answer-checking-status = ᱛᱮᱞᱟ ᱧᱮᱞ ᱠᱟᱱᱟ
answer-submitting-status = ᱛᱮᱞᱟ ᱠᱩᱞ ᱠᱟᱱᱟ
answer-correct = ᱴᱷᱤᱠ
answer-incorrect = ᱵᱷᱩᱞ
answer-response-saved = ᱛᱮᱞᱟ ᱫᱚᱦᱚ ᱦᱩᱭᱮᱱᱟ
answer-percent-credit = { $percent }% ᱱᱚᱢᱵᱚᱨ
answer-percent-correct = { $percent }% ᱴᱷᱤᱠ
answer-percent-short = { $percent } %
max-credit-available = ᱵᱟᱰᱟᱭ ᱦᱩᱭᱩᱜ ᱠᱟᱱ ᱢᱟᱨᱟᱝ ᱱᱚᱢᱵᱚᱨ: { $percent }%
attempts-remaining =
    { $count ->
        [0] ᱡᱟᱦᱟᱸ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱵᱟᱝ ᱛᱟᱦᱮᱸᱱᱟ
        [one] { $count } ᱠᱩᱨᱩᱢᱩᱴᱩ ᱛᱟᱦᱮᱸᱱᱟ
        [two] { $count } ᱠᱩᱨᱩᱢᱩᱴᱩᱠᱤᱱ ᱛᱟᱦᱮᱸᱱᱟ
       *[other] { $count } ᱠᱩᱨᱩᱢᱩᱴᱩᱠᱚ ᱛᱟᱦᱮᱸᱱᱟ
    }
validation-correct = (ᱴᱷᱤᱠ)
validation-incorrect = (ᱵᱷᱩᱞ)
validation-partially-correct = (ᱦᱟᱹᱴᱤᱧ ᱛᱮ ᱴᱷᱤᱠ)
answer-show-responses =
    { $count ->
        [one] { $answerId } ᱞᱟᱹᱜᱤᱫ { $count } ᱛᱮᱞᱟ ᱩᱫᱩᱜ ᱢᱮ
        [two] { $answerId } ᱞᱟᱹᱜᱤᱫ { $count } ᱛᱮᱞᱟᱠᱤᱱ ᱩᱫᱩᱜ ᱢᱮ
       *[other] { $answerId } ᱞᱟᱹᱜᱤᱫ { $count } ᱛᱮᱞᱟᱠᱚ ᱩᱫᱩᱜ ᱢᱮ
    }

## Disclosure panels

feedback-heading = ᱛᱮᱞᱟ ᱠᱟᱛᱷᱟ
collapsible-click-to-open = (ᱡᱷᱤᱡ ᱞᱟᱹᱜᱤᱫ ᱠᱞᱤᱠ ᱢᱮ)
collapsible-click-to-close = (ᱵᱚᱸᱫ ᱞᱟᱹᱜᱤᱫ ᱠᱞᱤᱠ ᱢᱮ)
collapsible-initializing = ᱮᱛᱦᱚᱵ ᱠᱟᱱᱟ…
footnote-show = ᱡᱟᱸᱜᱟ ᱴᱤᱯᱚᱱ ᱩᱫᱩᱜ ᱢᱮ
footnote-hide = ᱡᱟᱸᱜᱟ ᱴᱤᱯᱚᱱ ᱩᱠᱩ ᱢᱮ
description-more-information = ᱟᱨᱦᱚᱸ ᱠᱟᱛᱷᱟ

## Controls

slider-previous = ᱢᱟᱲᱟᱝᱟᱜ
slider-next = ᱛᱟᱭᱚᱢᱟᱜ
keyboard-open = ᱠᱤᱵᱚᱨᱰ ᱡᱷᱤᱡ ᱢᱮ
keyboard-close = ᱠᱤᱵᱚᱨᱰ ᱵᱚᱸᱫ ᱢᱮ
choice-input-remove-choice = { $choice } ᱚᱪᱚᱜ ᱢᱮ
matrix-remove-row = ᱥᱟᱨᱤ ᱚᱪᱚᱜ ᱢᱮ
matrix-add-row = ᱥᱟᱨᱤ ᱥᱮᱞᱮᱫ ᱢᱮ
matrix-remove-column = ᱠᱷᱟᱸᱴ ᱚᱪᱚᱜ ᱢᱮ
matrix-add-column = ᱠᱷᱟᱸᱴ ᱥᱮᱞᱮᱫ ᱢᱮ
subset-add-remove-points = ᱴᱩᱰᱟᱹᱜ ᱥᱮᱞᱮᱫ/ᱚᱪᱚᱜ ᱢᱮ
subset-toggle-points-intervals = ᱴᱩᱰᱟᱹᱜ ᱟᱨ ᱟᱸᱛᱚᱨᱟᱞ ᱵᱚᱫᱚᱞ ᱢᱮ
subset-move-points = ᱴᱩᱰᱟᱹᱜ ᱟᱛᱟᱝ ᱢᱮ
subset-clear = ᱢᱮᱴᱟᱣ ᱢᱮ
orbital-add-row = ᱥᱟᱨᱤ ᱥᱮᱞᱮᱫ ᱢᱮ
orbital-remove-row = ᱥᱟᱨᱤ ᱚᱪᱚᱜ ᱢᱮ
orbital-add-box = ᱵᱟᱠᱚᱥ ᱥᱮᱞᱮᱫ ᱢᱮ
orbital-remove-box = ᱵᱟᱠᱚᱥ ᱚᱪᱚᱜ ᱢᱮ
orbital-add-up-arrow = ᱪᱮᱛᱟᱱ ᱛᱤᱨ ᱥᱮᱞᱮᱫ ᱢᱮ
orbital-add-down-arrow = ᱞᱟᱛᱟᱨ ᱛᱤᱨ ᱥᱮᱞᱮᱫ ᱢᱮ
orbital-remove-arrow = ᱛᱤᱨ ᱚᱪᱚᱜ ᱢᱮ
orbital-row-label = ᱥᱟᱨᱤ { $row } ᱨᱮᱱ ᱧᱩᱛᱩᱢ
pretzel-answer = ᱛᱮᱞᱟ

## Math input

math-input-preview-region = ᱜᱟᱱᱤᱛ ᱠᱟᱛᱷᱟ ᱨᱮᱱ ᱢᱟᱲᱟᱝ ᱧᱮᱞ
math-input-preview = ᱢᱟᱲᱟᱝ ᱧᱮᱞ
math-input-invalid-expression = ᱵᱟᱝ ᱴᱷᱤᱠ ᱠᱟᱛᱷᱟ:

## Document status

viewer-initializing = ᱮᱛᱦᱚᱵ ᱠᱟᱱᱟ…

## Errors

error-heading = ᱵᱷᱩᱞ
error-found-at =
    { $span ->
        [line] ᱥᱟᱨᱤ { $startLine } ᱨᱮ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ।
       *[lines] ᱥᱟᱨᱤ { $startLine }–{ $endLine } ᱨᱮ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ।
    }
document-contains-errors = ᱱᱚᱶᱟ ᱫᱟᱞᱤᱞ ᱨᱮ ᱵᱷᱩᱞ ᱢᱮᱱᱟᱜᱼᱟ!
diagnostic-heading-error = ᱵᱷᱩᱞ
diagnostic-heading-warning = ᱦᱟᱸᱥᱤᱭᱟᱨ
diagnostic-heading-information = ᱠᱟᱛᱷᱟ
diagnostic-heading-hint = ᱪᱤᱱᱦᱟᱹ
accessibility-heading-level-1 = WCAG AA ᱥᱩᱜᱚᱢ ᱨᱮᱱ ᱵᱷᱩᱞ
accessibility-heading-level-2 = ᱥᱩᱜᱚᱢ ᱨᱮᱱ ᱠᱟᱛᱷᱟ
something-went-wrong = ᱚᱠᱟ ᱦᱚᱸ ᱵᱷᱩᱞ ᱦᱩᱭᱮᱱᱟ।
renderer-load-failed = ᱢᱤᱫ ᱩᱫᱩᱜᱤᱡ ᱞᱚᱰ ᱵᱟᱭ ᱦᱩᱭ ᱠᱮᱫᱼᱟ। ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱥᱟᱦᱴᱟ ᱫᱚᱦᱲᱟ ᱞᱚᱰ ᱢᱮ।
core-start-failed = ᱫᱟᱞᱤᱞ ᱩᱫᱩᱜᱤᱡ ᱵᱟᱭ ᱮᱛᱦᱚᱵ ᱠᱮᱫᱼᱟ। ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱥᱟᱦᱴᱟ ᱫᱚᱦᱲᱟ ᱞᱚᱰ ᱢᱮ।
