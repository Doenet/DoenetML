# Scots viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Scots is this batch's hardest catalog to check, and the reason is that it
# looks like the source.** English is its sister language and its roofing
# language both, so a seed that has nothing to say falls into English without
# anything looking wrong — a failure mode no other catalog in this repository
# has in this form. `locales/bi` records the same trap for an English-lexified
# creole and answers it the same way: a word is written here because a Scots
# dictionary has it, not because it differs from English. «richt», «wrang»,
# «pynt», «raw», «shaw», «tak awa», «eik on», «redd», «neist», «mistak»,
# «quaisten», «darg», «pruif», «reid», «blae», «yella», «broun», «fitnote»,
# «lade» and «gin» are the words this file leans on, and a reviewer's first job
# is to say which of them a reader would actually meet.
#
# **Orthography.** The spellings follow the Dictionaries of the Scots
# Language's headwords rather than any one regional convention, and no
# apologetic apostrophe is used: «wi» not «wi'», «o» not «o'». Scots is written
# without them in modern practice, and an apostrophe would mark the word as a
# defective English one, which is the whole thing this file is trying not to
# be.
#
# **Number.** CLDR has **no** plural rules for `sco`:
# `Intl.PluralRules("sco")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch in this file would be selected by some
# other language. None appears anywhere. `one`/`other` is kept, because it is
# the split the fallback happens to make correctly for Scots as well —
# «attempt» and «attempts» — and `[0]` is matched against the number itself
# rather than against a category and so stays legal. `chrome.test.ts` holds
# both halves for the seven catalogs of this batch CLDR has no data for.


## Answer submission

answer-checking = Checkin…
answer-submitting = Sendin…
answer-checking-status = Checkin the answer
answer-submitting-status = Sendin the answer
answer-correct = Richt
answer-incorrect = Wrang
answer-response-saved = Repone Saved
answer-percent-credit = { $percent }% Credit
answer-percent-correct = { $percent }% Richt
answer-percent-short = { $percent } %
max-credit-available = Maist credit tae be haen: { $percent }%
attempts-remaining =
    { $count ->
        [0] nae attempts left
        [one] { $count } attempt left
       *[other] { $count } attempts left
    }
validation-correct = (Richt)
validation-incorrect = (Wrang)
validation-partially-correct = (Pairtly richt)
answer-show-responses =
    { $count ->
        [one] Shaw { $count } repone tae { $answerId }
       *[other] Shaw { $count } repones tae { $answerId }
    }

## Disclosure panels

feedback-heading = Feedback
collapsible-click-to-open = (click tae open)
collapsible-click-to-close = (click tae steek)
collapsible-initializing = Settin up…
footnote-show = Shaw the fitnote
footnote-hide = Hide the fitnote
description-more-information = mair information

## Controls

slider-previous = Afore
slider-next = Neist
keyboard-open = Open the Keyboard
keyboard-close = Steek the Keyboard
choice-input-remove-choice = Tak awa { $choice }
matrix-remove-row = Tak awa a raw
matrix-add-row = Eik on a raw
matrix-remove-column = Tak awa a column
matrix-add-column = Eik on a column
subset-add-remove-points = Eik on / tak awa pynts
subset-toggle-points-intervals = Swap atween pynts an intervals
subset-move-points = Muive the Pynts
subset-clear = Redd
orbital-add-row = Eik on a Raw
orbital-remove-row = Tak awa a Raw
orbital-add-box = Eik on a Box
orbital-remove-box = Tak awa a Box
orbital-add-up-arrow = Eik on an Up Arrae
orbital-add-down-arrow = Eik on a Doun Arrae
orbital-remove-arrow = Tak awa an Arrae
orbital-row-label = Label for raw { $row }
pretzel-answer = Answer

## Math input

math-input-preview-region = forespeak o the mathematical expression
math-input-preview = Forespeak
math-input-invalid-expression = The expression isna valid:

## Document status

viewer-initializing = Settin up…

## Errors

error-heading = Mistak
error-found-at =
    { $span ->
        [line] Fund on line { $startLine }.
       *[lines] Fund on lines { $startLine }–{ $endLine }.
    }
document-contains-errors = This document haes mistaks in it!
diagnostic-heading-error = Mistak
diagnostic-heading-warning = Warnin
diagnostic-heading-information = Info
diagnostic-heading-hint = Hint
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = WCAG AA Accessibility Brek
accessibility-heading-level-2 = Accessibility alert
something-went-wrong = Somethin gaed wrang.
renderer-load-failed = a renderer didna lade. Please lade the page again.
core-start-failed = This document couldna be stertit. Please lade the page again.
core-start-failed-busy = This document couldna be stertit. Mony documents war stertin at aince, an that can tak langer on a slawer machine. Ladin the page again micht help aince the ither documents are duin.
core-start-failed-retry = This document couldna be stertit.
core-start-failed-busy-retry = This document couldna be stertit. Mony documents war stertin at aince, an that can tak langer on a slawer machine.
core-start-retry = Try again
saved-state-unavailable = Yer saved darg couldna be ladit.
