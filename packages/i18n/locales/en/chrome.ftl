# Viewer chrome: buttons, panel headers, and other UI the reader interacts
# with. Rendered on the main thread and selected by `uiLocale`.
#
# Message ids are lower-kebab-case Fluent identifiers, optionally with a
# single `.attribute` suffix (`submit-button`, `answer-status.correct`).
#
# This catalog is the source of truth for every other locale: `lint:i18n`
# rejects a translation that defines a key missing here. Run
# `npm run codegen -w @doenet/i18n` after editing.


## Answer submission — the check-work button and the status it reports.

answer-checking = Checking...
answer-submitting = Submitting...

# Announced to a screen reader while the submission is in flight. Separate
# from the button's own text, which is abbreviated.
answer-checking-status = Checking answer
answer-submitting-status = Submitting answer

answer-correct = Correct
answer-incorrect = Incorrect

# Shown instead of a correctness verdict when the activity withholds
# correctness: the response was recorded, nothing is claimed about it.
answer-response-saved = Response Saved

# Partial credit. `-credit` is used when repeated attempts reduce the credit
# available, `-correct` when they do not, and `-short` on a button too narrow
# for a word.
answer-percent-credit = { $percent }% Credit
answer-percent-correct = { $percent }% Correct
answer-percent-short = { $percent } %

max-credit-available = Max credit available: { $percent }%

attempts-remaining =
    { $count ->
        [0] no attempts remaining
        [one] { $count } attempt remaining
       *[other] { $count } attempts remaining
    }

# Appended to an input's accessible name once its response has been graded,
# so a screen reader reports the verdict along with the field.
validation-correct = (Correct)
validation-incorrect = (Incorrect)
validation-partially-correct = (Partially correct)


## Disclosure panels

feedback-heading = Feedback

# Follows the solution's own heading: "Solution (click to open)".
solution-click-to-open = (click to open)
solution-click-to-close = (click to close)
solution-initializing = Initializing...

# Tooltip on a footnote marker, naming what activating it will do.
footnote-show = Show footnote
footnote-hide = Hide footnote

# Tooltip on the ⓘ affordance that reveals an input's description.
description-more-information = more information


## Controls

slider-previous = Prev
slider-next = Next

keyboard-open = Open Keyboard
keyboard-close = Close Keyboard

# Accessible names of a matrix input's size controls, whose visible labels are
# the symbols `r-` `r+` `c-` `c+`.
matrix-remove-row = Remove row
matrix-add-row = Add row
matrix-remove-column = Remove column
matrix-add-column = Add column


## Math input

# Accessible name of the popover that previews the typed expression, and of
# the rendered expression inside it.
math-input-preview-region = math expression preview
math-input-preview = Preview
math-input-invalid-expression = Invalid expression:


## Document status

# Shown while the core is still starting up and nothing can be rendered yet.
# The four-dot ellipsis reproduces today's English exactly; normalizing it is
# a separate change, since doing it here would alter English output.
viewer-initializing = Initializing....


## Errors

# Prefixes the message of a document that failed to compile.
error-heading = Error

# Banner above a document that compiled with at least one error in it.
document-contains-errors = This document contains errors!
