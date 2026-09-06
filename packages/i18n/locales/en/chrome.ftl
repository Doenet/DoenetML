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

# Accessible name of the button that drops one selected choice from an inline
# `<choiceInput selectMultiple>`. The button itself is drawn as a bare cross,
# so `$choice` — the choice's own text, which is never translated — is the
# only thing that says which chip it belongs to.
choice-input-remove-choice = Remove { $choice }

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

# Caption above the table a `<summaryStatistics>` renders. It used to name the
# data column being summarized; the statistics now come from values written in
# the document, so there is no column to name and the message takes no
# placeable. The table's own headings (`mean`, `stdev`, `quartile1`, …) are the
# statistic ids an author references, not prose, and stay in place.
#
# Every translation of the old message named the column inside the sentence —
# «Resumen estadístico de { $column }» — so none of them survives the placeable
# being dropped, and the key was removed from the other catalogs rather than
# truncated to whatever precedes the connector. Those locales fall back to
# English here until the caption is translated again.
summary-statistics-caption = Summary statistics


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

# Follows the error's own message inside that box, saying where in the source
# the error was found. $span selects the sentence — one line or a range of
# them — as a key rather than a phrase, so a translation is free to reorder the
# whole of it. $startLine and $endLine are line numbers, and arrive as text
# rather than as numbers so that line 1234 is not grouped as "1,234": a line
# number is an identifier, not a quantity.
error-found-at =
    { $span ->
        [line] Found on line { $startLine }.
       *[lines] Found on lines { $startLine }–{ $endLine }.
    }

# Banner above a document that compiled with at least one error in it.
document-contains-errors = This document contains errors!

# Headings of the tooltip the editor shows over a squiggle, naming what kind
# of diagnostic it is. `-information` and `-hint` are styled identically but
# are two different words; `-hint` is unreachable today, since nothing Doenet
# raises is an LSP hint, and is here so the set is complete.
diagnostic-heading-error = Error
diagnostic-heading-warning = Warning
diagnostic-heading-information = Info
diagnostic-heading-hint = Hint

# Headings of the same tooltip over an accessibility diagnostic, which says
# what kind of problem it is rather than how severe. Level 1 is a failure
# against the WCAG AA success criteria; level 2 is Doenet's own advice, which
# no standard requires.
accessibility-heading-level-1 = WCAG AA Accessibility Violation
accessibility-heading-level-2 = Accessibility alert

# Shown in place of the document when a renderer threw and the error boundary
# caught it.
something-went-wrong = Something went wrong.

# Shown in place of a single renderer whose code chunk never arrived.
renderer-load-failed = a renderer failed to load. Please reload the page.

# Shown in place of the document when the core worker could not be started
# after retries, rather than leaving the pane blank.
core-start-failed = This document could not be started. Please reload the page.

# Replaces `core-start-failed` when several documents were starting at the
# same time — counted across every same-origin tab, so not necessarily all on
# the page the reader sees. Naming the contention keeps the reader from
# concluding the service is broken.
core-start-failed-busy = This document could not be started. Several documents were starting at once, which can take longer on a slower device. Reloading the page may help once the other documents have finished.

# Shown for a core-start failure the reader can still retry, next to the
# button that does it (`core-start-retry`). It leaves out the advice to
# reload that the messages above carry: the button is the cheaper action,
# and a reader told to reload will reload the whole page — restarting every
# other document on it, which is what produced the failure in the first
# place on a page that was already busy.
core-start-failed-retry = This document could not be started.

# The contended variant of `core-start-failed-retry`, named for the same
# reason `core-start-failed-busy` is: a reader who is told that several
# documents were starting at once has a reason to try again in a moment
# rather than concluding the service is broken.
core-start-failed-busy-retry = This document could not be started. Several documents were starting at once, which can take longer on a slower device.

# Label of the button that starts a failed document over without reloading
# the page. Offered once per document; a retry that fails too falls back to
# `core-start-failed` / `core-start-failed-busy`, which advise the reload.
core-start-retry = Try again

# Shown beside a document that is on screen and working, when the host
# answered `SPLICE.getState` with an error and so the document started
# without the reader's saved work (#1741). The host's own wording follows
# this lead-in, so it says what was lost rather than why.
saved-state-unavailable = Your saved work could not be loaded.
