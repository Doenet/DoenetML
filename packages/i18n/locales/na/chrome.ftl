# Nauruan (dorerin Naoero) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **1938 reformed spelling** — the one
# the Nauruan orthography committee settled, which carries the tilde vowels
# «ã», «ẽ», «ĩ», «õ», «ũ» and the letter «ñ», and which spells the island
# «Naoero». The older missionary spelling used by Delaporte's dictionary and
# Kayser's grammar writes several of the same sounds differently, and printed
# Nauruan today is inconsistent between the two — much of it drops the
# diacritics altogether. A reviewer who prefers the older spelling should
# convert the whole file rather than mix the two systems; a diacritic is part
# of the spelling here, not decoration.
#
# **What this seed could not establish, said plainly once.** Nauruan is
# Micronesian, and it is the family's most divergent member: a large part of
# its lexicon has no transparent cognate in Marshallese, Chuukese, Pohnpeian,
# Kosraean or Gilbertese, and published Nauruan lexical material is thin and
# hard to reach. So this seed **did not derive its vocabulary from the other
# Micronesian catalogs of this batch** (`mh`, `chk`, `pon`, `kos`, `gil`) the
# way `locales/sms` derived its from Northern Sami — a regular correspondence
# is what makes that sound, and Nauruan does not offer one. It agrees with
# those five about *structure* and disagrees with them about *method*.
#
# What it does instead: **every technical term is kept as the English word, in
# English spelling, and is marked as a loan rather than dressed up as
# Nauruan.** That is a real fact about Nauru — schooling and mathematics
# teaching there are in English, and the language already takes institutional
# loans («Repubrikin Naoero») — but it is also a confession: this seed could
# not find the Nauruan words, and respelling English by an invented loan
# phonology would have presented a guess as a fact. The **frame** is this
# file's contribution — word order, the linker, the absence of gender and
# number agreement, the variant keys — and the **lexicon** is the debt. A
# speaker replacing the nouns and verbs below is doing the work this file was
# written to make easy, and needs no permission for any of it.
#
# The only Nauruan words this seed commits to are:
#   «Naoero»      Nauru, the island and the language's home
#   «dorer»       word, speech, language («dorerin Naoero», the Nauruan
#                 language) — the source of the linker below
#   «-n» / «-in»  the construct linker joining a head noun to what follows
#                 it, as in «Repubrikin Naoero» and «dorerin Naoero». This is
#                 the one productive rule the seed applies, and it applies it
#                 only where a genitive is plainly wanted.
#   «ma»          and, with. Supported by the national anthem's «ngabena ma
#                 auwe» and by Gilbertese «ma», Nauruan's nearest neighbour —
#                 a comparative inference, not an attestation. Check it first.
# Everything else below is a loan. (`content.ftl` adds two attested colour
# words to that list — «etangang» black and «ebabobo» yellow — and sources
# them in its own header; no message in this file uses either.)
#
# **No grammatical gender**, so `noun-gender` answers one token and no
# adjective in these files forks on `$gender`. **No `$role` fork** either:
# nothing here changes shape between a standalone position and a clause.
#
# **Number.** A Nauruan noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it. `Intl.PluralRules`
# has no CLDR data for `na` and resolves against the runtime's default locale,
# so a `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select. Where a message merely prints a count this file writes **one
# unselected form**, as `locales/sm` does; where English's two branches differ
# in something other than the noun's number, `one` and `*[other]` are kept so
# that no branch goes missing.
#
# **Word order: the describing word follows the noun** — «Nauru Bwiema» is the
# shape — and all five of the batch's other Micronesian catalogs put it there
# too: `mh`, `chk`, `pon`, `kos` and `gil` all write `{ $noun }` ahead of
# `{ $description }`, as `ch`, `sm` and `to` already did. That is the batch
# agreement this catalog joins, and it is the one thing here that was checked
# against the siblings rather than inferred. Gilbertese writes a linker «ae»
# between the two; this file writes none, because nothing establishes that
# Nauruan wants one — a reviewer who knows otherwise should add it in
# `style-with-noun`, `style-filled-with-noun` and `style-fill` together.
#
# **Where this catalog deliberately parts company with its five siblings.**
# Those five write their own lexicons — «Ejim̧we», «Pwaye», «Te kairua» — and
# this one does not, and the difference is evidence rather than effort.
# Marshallese, Chuukese, Pohnpeian, Kosraean and Gilbertese each have a
# published dictionary this seed could lean on; Nauruan's are a 1907
# Nauruan-German dictionary and a 1936 grammar, and what this seed could
# actually reach of them is a handful of words. A file that matched the
# siblings word for word would be matching their *appearance*. So the divide
# runs down the middle of this batch on purpose, and it is a divide about what
# was knowable.
#
# `attempts-remaining` and `answer-show-responses` therefore keep only a `[0]`
# literal and a default: the noun beside the count does not move, so a second
# branch would be a copy of the first.
#
# **The size of the debt, said plainly, as `diagnostics.ftl` says it there:
# every message in this file stands in English.** None of them reaches «dorer»
# or «ma» or the linker — a sentence assembled entirely out of loans is an
# English sentence — and this file should be read as a scaffold rather than as
# a translation. Its ids, placeables, variant keys and argument names are
# already in the right place, so a speaker rewriting a message supplies words
# and changes nothing structural. `content.ftl` is the one file of the four
# that carries Nauruan text, and it carries two colour words.

## Answer submission

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
