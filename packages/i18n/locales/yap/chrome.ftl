# Yapese (thin nu Waqab) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **standard Yapese orthography** — the
# one settled in Jensen's grammar and Yapese–English dictionary (1977) and used
# by the Yap State Department of Education since. Two of its conventions are
# spelling and not decoration:
#
#   * the **glottal stop is the letter «q»**, which is why the island and the
#     people are «Waqab» and not «Wa'ab». It is a consonant of the language and
#     is written everywhere it is heard, including word-initially.
#   * the **underlined series «ḏ», «ḻ», «ṉ», «ṟ»** (Jensen prints a bar under
#     the letter) are letters of their own, distinct from plain «d», «l», «n»,
#     «r», and «th» and «ch» are single letters too.
#
# Printed Yapese today is inconsistent about both: much of it substitutes an
# apostrophe for «q» and drops the underlines altogether. A reviewer who
# prefers that spelling should convert the whole file rather than mix the two
# systems. Few of the words this seed commits to happen to contain an
# underlined letter — that is a fact about how little vocabulary is here, not a
# claim that the series is rare, and a reviewer replacing the loans below will
# need all four.
#
# **Yapese is Oceanic but it is not Micronesian in the narrow sense.** Yap is a
# state of the Federated States of Micronesia, and this batch seeds catalogs
# for its neighbours — `mh`, `chk`, `pon`, `kos`, `gil` — but Yapese is not a
# Nuclear Micronesian language: its position inside Oceanic is disputed and it
# is best treated as an isolate branch, and its lexicon is unlike its
# neighbours' word for word. **So no form here was borrowed from those
# catalogs**, and none should be. Sharing a flag is not a sound correspondence.
# That is the method `locales/sms` used from Northern Sami running the other
# way, and it is the same refusal `locales/na` makes for Nauruan — this file
# agrees with `locales/na` about method and shares none of its vocabulary.
#
# **What this seed could not establish, said plainly once.** Published Yapese
# lexical material is thin and hard to reach, and this seed could not find
# Yapese words for the technical vocabulary these catalogs are made of. So
# **every technical term below is kept as the English word, in English
# spelling, and is a loan rather than a translation.** That is a real fact
# about Yap — schooling, and mathematics teaching in particular, are in
# English — but it is also a confession, and respelling English by an invented
# loan phonology would have presented a guess as a fact. The **frame** is this
# file's contribution — word order, the linker, the absence of gender and of
# number agreement, the variant keys — and the **lexicon** is the debt. A
# speaker replacing the nouns and verbs below is doing the work this file was
# written to make easy, and needs no permission for any of it.
#
# The only Yapese words this seed commits to are:
#   «Waqab»    Yap, the island group and the language's home
#   «thin»     word, speech, language — «thin nu Waqab», the Yapese language
#   «nu»       of, from (as in «thin nu Waqab»)
#   «e»        the common-noun determiner, the commonest word in Yapese text
#   «ni»       the linker that joins a head noun to the modifier or relative
#              clause following it. This is the one productive rule the seed
#              applies, and it applies it only where a modifier plainly
#              follows a noun.
#   «nge»      and, with — joining nouns and joining a phrase to what
#              accompanies it.
# Everything else below is a loan. Check «e» and «nge» first: both are frequent
# enough that a wrong choice is wrong in many places at once.
#
# **Word order: the modifier follows the noun**, linked by «ni». So a style
# description is built as noun + «ni» + description — the opposite of English's
# order, and the opposite of every catalog in the Uralic batch. The `content`
# file is where that shows.
#
# **No grammatical gender.** Yapese has none, so `noun-gender` answers one
# token, and no adjective in these files forks on `$gender`. **No `$role` fork**
# either: nothing here changes shape between a standalone position and a
# clause.
#
# **Counting, and how this seed avoided it.** Yapese counts with an obligatory
# **numeral-classifier** system: a numeral is compounded with a classifier
# chosen by what is being counted (humans, long things, flat things, general
# things), and possession is marked by a second, separate set of **possessive
# classifiers**. A spelled-out Yapese numeral therefore cannot be written
# without deciding what kind of thing follows it. This seed never spells a
# numeral: every count reaches the reader as the `{ $count }` placeable, which
# Fluent renders in digits, so no classifier is ever forced and none is
# invented. A reviewer who wants spelled numerals has to supply the classifier
# with them — and cannot do it inside a placeable, which is the affix rule in
# the README.
#
# **Number.** A Yapese noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it, and a single
# unselected form is right wherever English forks. `Intl.PluralRules` has no
# CLDR data for `yap` and resolves against the runtime's default locale, so a
# `[two]`, `[few]` or `[many]` branch here would be text nothing could select.
# Only `one`, `other` and explicit digit literals appear, and where English
# forks on number for grammar this file keeps the fork only because the
# English words in the branches differ.
#
# **A named debt.** The piecewise connectives — `piecewise-condition-if`,
# `-or`, `-otherwise` — are basic grammar rather than technical vocabulary, and
# are exactly where a frame contribution belongs; this seed still left them in
# English because it could not establish the Yapese conditional and
# disjunctive particles with any confidence. They are the first three lines a
# speaker should fix, and fixing them costs three lines.


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
        [one] { $count } attempt remaining
       *[other] { $count } attempts remaining
    }

validation-correct = (Correct)
validation-incorrect = (Incorrect)
validation-partially-correct = (Partially correct)

answer-show-responses =
    { $count ->
        [one] Show { $count } response to { $answerId }
       *[other] Show { $count } responses to { $answerId }
    }


feedback-heading = Feedback

collapsible-click-to-open = (click to open)
collapsible-click-to-close = (click to close)

collapsible-initializing = Initializing...

footnote-show = Show footnote
footnote-hide = Hide footnote

description-more-information = more information


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


math-input-preview-region = math expression preview
math-input-preview = Preview
math-input-invalid-expression = Invalid expression:


viewer-initializing = Initializing...


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
