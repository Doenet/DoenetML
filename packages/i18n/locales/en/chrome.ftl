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

# Fluent formats `{ $count }` with `Intl.NumberFormat`, so a four-digit
# attempt count renders as "1,000" where the hand-built string said "1000".
# That is the one place English output is not byte-identical to what this
# replaced, and grouping is the locale-correct rendering, so it stands.
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

# Tooltip on the badge that reports how many responses have been submitted to
# one answer, shown only to a host that asked for it. `$answerId` is the
# answer's authored name and is never translated.
answer-show-responses =
    { $count ->
        [one] Show { $count } response to { $answerId }
       *[other] Show { $count } responses to { $answerId }
    }


## Disclosure panels

feedback-heading = Feedback

# Follows a disclosure panel's own heading — "Solution (click to open)" — and
# is shared by `<solution>`, `<hint>`, and a collapsible `<section>`. The whole
# parenthetical is one message: where the word for open or close falls inside
# it is the translator's business.
collapsible-click-to-open = (click to open)
collapsible-click-to-close = (click to close)

# Placeholder inside a panel that has been opened before its contents have
# arrived from the core. Shared by `<solution>` and a collapsible `<section>`.
collapsible-initializing = Initializing...

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

# Modes and actions of the subset-of-reals input's control strip. The button
# that selects all of the reals is the symbol `R`, not a word, and stays in
# place.
subset-add-remove-points = Add/Remove points
subset-toggle-points-intervals = Toggle points and intervals
subset-move-points = Move Points
subset-clear = Clear

# Buttons that edit an orbital diagram: rows hold boxes, boxes hold up to
# three spin arrows.
orbital-add-row = Add Row
orbital-remove-row = Remove Row
orbital-add-box = Add Box
orbital-remove-box = Remove Box
orbital-add-up-arrow = Add Up Arrow
orbital-add-down-arrow = Add Down Arrow
orbital-remove-arrow = Remove Arrow

# Accessible name of the text field naming one row of an orbital diagram,
# counting from 1.
orbital-row-label = Label for row { $row }

# Labels the answer column of a pretzel exercise's grid.
pretzel-answer = Answer

# Caption above the table a `<summaryStatistics>` renders. `$column` is the
# authored name of the data column being summarized and is never translated.
# The table's own headings (`mean`, `stdev`, `quartile1`, …) are the statistic
# ids an author references, not prose, and stay in place.
summary-statistics-caption = Summary statistics of { $column }


## Math input

# Accessible name of the popover that previews the typed expression, and of
# the rendered expression inside it.
math-input-preview-region = math expression preview
math-input-preview = Preview
math-input-invalid-expression = Invalid expression:


## Document status

# Shown while the core is still starting up and nothing can be rendered yet.
viewer-initializing = Initializing...


## Errors

# Prefixes an error message wherever one is shown in place of content: an
# `<error>` the core reported, the error boundary's fallback, and the
# placeholder left where a renderer chunk failed to load.
error-heading = Error

# Banner above a document that compiled with at least one error in it.
document-contains-errors = This document contains errors!

# Shown in place of the document when a renderer threw and the error boundary
# caught it.
something-went-wrong = Something went wrong.

# Shown in place of a single renderer whose code chunk never arrived.
renderer-load-failed = a renderer failed to load. Please reload the page.

# Shown in place of the document when the core worker could not be started
# after retries, rather than leaving the pane blank.
core-start-failed = The document viewer could not be started. Please reload the page.
