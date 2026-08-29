# Rotuman (Fäeag Rotuạm) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Where Rotuman sits.** Rotuman is **Oceanic, and an isolate within
# Oceanic**: it is not Polynesian, and it is not Fijian. Centuries of contact
# with Tonga, Sāmoa and Futuna have left a heavy Polynesian layer on top of it,
# which is exactly what makes it dangerous to seed — a word that looks
# Polynesian may be a loan, a chance resemblance, or nothing at all. So this
# file **does not assume cognates with the Polynesian catalogs of this batch**
# (`sm`, `to`, `niu`, `tkl`, `tvl`, `wls`, `rar`, `ty`, `mi`, `haw`): where it
# writes a Rotuman word it writes one it could support on its own, and where it
# could not it writes the English word and says so below.
#
# `locales/fj` (Fijian) is the **nearest existing catalog geographically** —
# Rotuma is part of Fiji, and Rotuman children meet Fijian in school — but
# Fijian is a different branch of Oceanic. Anything this file has in common
# with `locales/fj` is typological or areal, never inherited, and no word here
# was taken from it.
#
# **Orthography.** This file writes the **Churchward orthography**, the one
# used by the 1940 grammar and dictionary and by printed Rotuman since: the
# diacritic letters «ä», «å», «ạ», «ẹ», «ọ» and «ụ» are **part of the
# spelling**, not decoration, and the glottal stop is written with an
# apostrophe («noa'ia», «Rotuạm»). A reviewer who strips the diacritics is
# writing a different orthography, not a simplified one, and should convert the
# whole catalog rather than one message.
#
# **Metathesis: the one thing this seed is most likely to have got wrong.**
# Nearly every Rotuman word has two phases — a **complete** phase and an
# **incomplete** phase formed from it by metathesis and vowel change («hosa» /
# «hoas», «fupa» / «fuap») — and which of the two appears is **grammatically
# determined**, not stylistic: broadly, the complete phase stands before the
# definite article and before what is suffixed to it, and the incomplete phase
# stands where the word is indefinite or ends its phrase.
#
# **This file writes the complete (citation) phase in every position**, because
# that is the form a dictionary gives and the only one this seed could derive
# reliably. That is certainly wrong in some of these positions — a bare button
# label naming an indefinite thing wants the incomplete phase — and a reviewer
# should check the phase of **every Rotuman word below before checking anything
# else about it**. The choice is uniform on purpose: one systematic error is
# findable where a scatter of guesses is not.
#
# **Lexicon: what this seed commits to, and what it does not.** Rotuman's
# published lexical material is a single grammar-and-dictionary tradition, and
# it has no settled vocabulary for graphs, functions, or the DoenetML machinery
# these files talk about — outside the style tables of `content.ftl`, whose
# colour and width words and three shape nouns are attested basic vocabulary
# and are sourced word by word in that file's header. Rather
# than dress English up in Rotuman shape, this catalog **keeps the technical
# vocabulary as the English word** and marks it as a loan — the `locales/na`
# method, for the same reason: the frame is this file's contribution and the
# lexicon is its debt. The Rotuman words it does commit to are:
#
#   «Rotuạm»      Rotuma; «Fäeag Rotuạm» the Rotuman language
#   «fäeag»       word, speech, language; to speak
#   «ma»          and, with — the one connective used below
#   «'e»          at, in, on
#   «ne»          of; that (the linker/relative)
#   «kepoi ka»    if — used once, in `piecewise-condition-if`, and the least
#                 certain item on this list. Check it first.
#
# Everything else in these files is English. Replacing any of it is the work
# this catalog was written to make easy, and needs no permission.
#
# **No grammatical gender.** `noun-gender` answers one token and no adjective
# in these files forks on `$gender`. **No `$role` fork** either: nothing here
# changes shape between a standalone position and a clause.
#
# **Number.** A Rotuman noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it. `Intl.PluralRules`
# has no CLDR data for `rtm` and resolves against the runtime's default locale,
# so a `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select — only `one`, `other` and explicit numeric literals are written.
#
# **Word order: the describing word follows the noun**, which is what «Fäeag
# Rotuạm» itself shows. `locales/fj` and the batch's Polynesian catalogs put it
# there too; that agreement is areal and typological rather than inherited, and
# it is recorded here as agreement about *shape*, not about descent.
#
# `attempts-remaining` and `answer-show-responses` therefore keep only a `[0]`
# literal and a default: nothing beside the count changes shape, so a second
# branch would be a copy of the first. Every other selector in this file keeps
# English's branches, because the text in them is English and English's own
# plural is what a reader of it expects — a rewrite into Rotuman is free to
# collapse them.

answer-checking = Checking...
answer-submitting = Submitting...

answer-checking-status = Checking answer
answer-submitting-status = Submitting answer

answer-correct = Correct
answer-incorrect = Incorrect

answer-response-saved = Response Saved

answer-percent-credit = { $percent }% Credit
answer-percent-correct = { $percent }% Correct
answer-percent-short = { $percent } %

max-credit-available = Max credit available: { $percent }%

attempts-remaining =
    { $count ->
        [0] no attempts remaining
       *[other] { $count } attempts remaining
    }

validation-correct = (Correct)
validation-incorrect = (Incorrect)
validation-partially-correct = (Partially correct)

answer-show-responses = Show { $count } responses to { $answerId }

## Disclosure panels

feedback-heading = Feedback

collapsible-click-to-open = (click to open)
collapsible-click-to-close = (click to close)

collapsible-initializing = Initializing...

footnote-show = Show footnote
footnote-hide = Hide footnote

description-more-information = more information

## Controls

slider-previous = Prev
slider-next = Next

keyboard-open = Open Keyboard
keyboard-close = Close Keyboard

choice-input-remove-choice = Remove { $choice }

matrix-remove-row = Remove row
matrix-add-row = Add row
matrix-remove-column = Remove column
matrix-add-column = Add column

subset-add-remove-points = Add/Remove points
subset-toggle-points-intervals = Toggle points and intervals
subset-move-points = Move Points
subset-clear = Clear

orbital-add-row = Add Row
orbital-remove-row = Remove Row
orbital-add-box = Add Box
orbital-remove-box = Remove Box
orbital-add-up-arrow = Add Up Arrow
orbital-add-down-arrow = Add Down Arrow
orbital-remove-arrow = Remove Arrow

orbital-row-label = Label for row { $row }

pretzel-answer = Answer

summary-statistics-caption = Summary statistics of { $column }

## Math input

math-input-preview-region = math expression preview
math-input-preview = Preview
math-input-invalid-expression = Invalid expression:

## Document status

viewer-initializing = Initializing...

## Errors

error-heading = Error

error-found-at =
    { $span ->
        [line] Found on line { $startLine }.
       *[lines] Found on lines { $startLine }–{ $endLine }.
    }

document-contains-errors = This document contains errors!

diagnostic-heading-error = Error
diagnostic-heading-warning = Warning
diagnostic-heading-information = Info
diagnostic-heading-hint = Hint

accessibility-heading-level-1 = WCAG AA Accessibility Violation
accessibility-heading-level-2 = Accessibility alert

something-went-wrong = Something went wrong.

renderer-load-failed = a renderer failed to load. Please reload the page.

core-start-failed = This document could not be started. Please reload the page.

core-start-failed-busy = This document could not be started. Several documents were starting at once, which can take longer on a slower device. Reloading the page may help once the other documents have finished.

core-start-failed-retry = This document could not be started.

core-start-failed-busy-retry = This document could not be started. Several documents were starting at once, which can take longer on a slower device.

core-start-retry = Try again

saved-state-unavailable = Your saved work could not be loaded.
