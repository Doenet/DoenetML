# Kpelle viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `kpe` is Kpelle, of Liberia (the large majority of its ~1.2M speakers) and
# southern Guinea (Nzérékoré/Yomou). Southwestern (South) Mande, per
# `en.wikipedia.org/wiki/Southwestern_Mande_languages` — the same higher-level
# Mande family as `locales/bm`, `locales/dyu` and `locales/mnk`, but a
# different, more distantly related branch (those three are Manding, a Central
# Mande group; Kpelle and Looma are Southwestern Mande, sharing no recent
# common ancestor with Manding within Mande).
#
# Kpelle has no noun-class or gender markers and no adjective agreement, so
# `$gender` and `$role` go unused here exactly as they do in `bm`/`dyu`/`mnk`.
# That is a genuine finding, not an assumption carried over from the Manding
# catalogs: South Mande does carry noun-class-like material, but it shows up
# as a *specificity/definiteness suffix inside the pronominal and demonstrative
# system* (Konoshenko and other South Mande descriptions), not as agreement
# marking on a following adjective — Kpelle adjectives are themselves mostly
# deverbal ("predicating" adjectives formed from verb stems) and simply follow
# the noun uninflected. So the fork-on-neither decision matches the other
# Mande catalogs, but for a different underlying reason than "Mande has no
# noun classes at all" — Central Mande genuinely lacks the suffixal machinery
# that South Mande has, it just never surfaces as adjective agreement either.
#
# Kpelle is essentially unattested in machine-translation training data (see
# arXiv:2505.18905, "Building a Functional Machine Translation Corpus for
# Kpelle", 2025, which starts from near zero). Combined with Liberia's
# English-medium schooling and heavy Kpelle–English code-switching in
# technical registers, this seed leans on English loanwords for UI and
# technical vocabulary far more than `bm`/`dyu`/`mnk` do, and keeps sentence
# grammar close to English where a confident Kpelle rendering could not be
# verified against a primary source. This makes it a *lower-confidence* seed
# than the Manding catalogs — flag it for review ahead of them.


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
core-start-failed = The document viewer could not be started. Please reload the page.
