# Manx (Gaelg) viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, in the traditional Manx orthography** — the English-based
# spelling of the Manx Bible and of Cregeen's «A Dictionary of the Manks
# Language» (1835) and Kelly's «Fockleyr Manninagh as Baarlagh», which is the
# only orthography Manx has ever had and the one Culture Vannin, Yn Cheshaght
# Ghailckagh and the Bunscoill Ghaelgagh use today. No Gaelic-style respelling
# is attempted: this file writes «çhengey», «ansoor», «jeeagh» as Manx does,
# not as Irish or Scottish Gaelic would. Digits are **Latin** (`1`, `2`,
# `1,234`), which is what DoenetML pins for every locale in `src/intl.ts`.
#
# **What is Manx here.** The copula and existential are «ta» and «cha nel»;
# «cha nod» is *cannot*, «shegin da» is *must*, «as» is *and*, «ny» is *or*,
# «my» is *if*, «er-nonney» is *otherwise*, «jeh» is *of*, «lesh» is *with*,
# «gyn» is *without*, «my sailliu» is *please*. Buttons carry the verbal noun
# the way a Manx label does — «Fosley», «Dooney», «Scughey», «Cur … rish»,
# «Soilshaghey», «Follaghey», «Gleashaghey». The everyday vocabulary is
# Cregeen's and Kelly's: «kiart» / «neu-chair» for right and wrong, «ansoor»
# for a response, «freggyrt» for feedback, «marranys» for an error, «duillag»
# for a page, «rea» and «colloo» for a row and a column, «side» for an arrow,
# «kishtey» for a box, «boayrd-ogher» for a keyboard.
#
# **What is borrowed, and from where.** Manx is a revived language whose
# terminology work (Culture Vannin's word lists, Yn Cheshaght Ghailckagh's
# publications) has not reached XML markup, so the markup vocabulary is
# **English, unchanged**: `attribute`, `component`, `element`, `reference`,
# `tag`, `renderer`, `WCAG`, and every DoenetML identifier. That is declared
# rather than disguised — a Manx speaker reading an editor reads those words in
# English. Where a Manx word exists it is used: «roshtynys» for *accessibility*
# (on roshtyn, *to reach*), «staydraaghyn» for *statistics*, «raaue» for
# *warning*, «cowrey» for *hint* and for a *sign*.
#
# **Counts.** CLDR gives Manx **rules of its own**. The declared categories are
# `one`, `two`, `few`, `many` and `other`, but for **integer** counts only four
# are ever selected:
#
#   one    n mod 10 = 1 — 1, 11, 21, 31, 41, 51, …
#   two    n mod 10 = 2 — 2, 12, 22, 32, 42, …
#   few    n mod 100 = 0, 20, 40, 60, 80 — 0, 20, 40, 60, 80, 100, 120, …
#   other  everything else — 3–10, 13–19, 23–30, …
#
# `many` is the fifth, and it is CLDR's category for a count written with a
# visible decimal fraction — 0.5, 1.5, 2.5. Nothing this software counts is
# ever written that way, so **there is no `[many]` branch anywhere in this
# catalog**, in any of the four files: a branch nothing selects is dead text.
#
# `few` gets no branch of its own either, for the opposite reason: it is
# reachable (0, 20, 40, …) but takes the **same** radical form `other` does,
# so `*[other]` already writes it and a `[few]` would only be a second copy.
#
# A Manx noun after a numeral stays **singular**; what varies is the mutation.
# «un» (1) and «daa» (2) lenite — b→v, c→ch, d→gh, g→gh, j→y, m→v, p→ph, s→h,
# t→h — and «feed» (20) and «tree»…«jeih» (3–10) do not. So `one` and `two`
# carry the lenited form and `few` and `other` the radical, and a branch
# differs from its neighbour in the **first letter** of the word.
#
# Where the message prints no numeral at all — a list whose length is counted
# but not shown — the select is **dropped**, because `one` there would catch a
# list of 11 items and give it a singular. That is a fact about Manx's rules,
# not laziness, and it is why `answer-show-responses` below has one form.
#
# **Weakest first.** «prowal» does duty for both *attempt* and *proof*;
# «roshtynys» and «staydraaghyn» are formations rather than dictionary entries;
# and the wholesale English markup vocabulary is the first thing a reviewer
# with Culture Vannin's word lists to hand should replace.


## Answer submission

answer-checking = Prowal…
answer-submitting = Cur stiagh…
answer-checking-status = Prowal yn ansoor
answer-submitting-status = Cur yn ansoor stiagh
answer-correct = Kiart
answer-incorrect = Neu-chiart
answer-response-saved = Ansoor sauailt
answer-percent-credit = { $percent }% jeh ny markyn
answer-percent-correct = { $percent }% kiart
answer-percent-short = { $percent } %
max-credit-available = Yn chooid smoo dy varkyn ry-gheddyn: { $percent }%
# «prowal» begins with `p`, which «un» and «daa» lenite to `ph`; «feed» and
# «tree» leave it alone. `[0]` catches none by number, as the English does, so
# the `few` category it would otherwise select for 0 is not reached there.
attempts-remaining =
    { $count ->
        [0] cha nel prowal faagit
        [one] { $count } phrowal faagit
        [two] { $count } phrowal faagit
       *[other] { $count } prowal faagit
    }
validation-correct = (Kiart)
validation-incorrect = (Neu-chiart)
validation-partially-correct = (Ayrn jeh kiart)
# No numeral is printed here — the count is the length of a list — so the
# select is dropped: `one` would catch 11 responses and give them a singular.
answer-show-responses = Soilshaghey { $count } ansoor da { $answerId }


## Disclosure panels

feedback-heading = Freggyrt
collapsible-click-to-open = (crig dy osley)
collapsible-click-to-close = (crig dy yeigh)
collapsible-initializing = Goaill toshiaght…
footnote-show = Soilshaghey yn notey-coshey
footnote-hide = Follaghey yn notey-coshey
description-more-information = tooilley fysseree


## Controls

slider-previous = Roie
slider-next = Nah
keyboard-open = Fosley yn boayrd-ogher
keyboard-close = Dooney yn boayrd-ogher
choice-input-remove-choice = Scughey { $choice }
matrix-remove-row = Scughey rea
matrix-add-row = Cur rea rish
matrix-remove-column = Scughey colloo
matrix-add-column = Cur colloo rish
subset-add-remove-points = Cur rish/scughey poyntyn
subset-toggle-points-intervals = Caghlaa eddyr poyntyn as reamyssyn
subset-move-points = Gleashaghey ny poyntyn
subset-clear = Glenney
# A `box` here is one orbital, drawn as a square: kishtey.
orbital-add-row = Cur rea rish
orbital-remove-row = Scughey rea
orbital-add-box = Cur kishtey rish
orbital-remove-box = Scughey kishtey
orbital-add-up-arrow = Cur side neese rish
orbital-add-down-arrow = Cur side neose rish
orbital-remove-arrow = Scughey side
orbital-row-label = Lipey son rea { $row }
pretzel-answer = Ansoor


## Math input

math-input-preview-region = roie-hilley yn loayrtys maddaghtagh
math-input-preview = Roie-hilley
math-input-invalid-expression = Loayrtys neu-chair:


## Document status

viewer-initializing = Goaill toshiaght…


## Errors

error-heading = Marranys
error-found-at =
    { $span ->
        [line] Feddynit er linney { $startLine }.
       *[lines] Feddynit er linnaghyn { $startLine }–{ $endLine }.
    }
document-contains-errors = Ta marranyssyn ayns y docamad shoh!
diagnostic-heading-error = Marranys
diagnostic-heading-warning = Raaue
diagnostic-heading-information = Fysseree
diagnostic-heading-hint = Cowrey
accessibility-heading-level-1 = Brishey roshtynys WCAG AA
accessibility-heading-level-2 = Raaue roshtynys
something-went-wrong = Hie red ennagh aggairagh.
renderer-load-failed = cha row renderer abyl dy laadey. Laad y duillag reesht, my sailliu.
core-start-failed = Cha row yn docamad shoh abyl dy ghoaill toshiaght. Laad y duillag reesht, my sailliu.
core-start-failed-busy = Cha row yn docamad shoh abyl dy ghoaill toshiaght. Va ymmodee docamadyn goaill toshiaght ec y traa cheddin, as foddee shen goaill ny smoo dy hraa er greie moal. Foddee dy jean laadey yn duillag reesht cooney erreish da ny docamadyn elley ve jeant.
core-start-failed-retry = Cha row yn docamad shoh abyl dy ghoaill toshiaght.
core-start-failed-busy-retry = Cha row yn docamad shoh abyl dy ghoaill toshiaght. Va ymmodee docamadyn goaill toshiaght ec y traa cheddin, as foddee shen goaill ny smoo dy hraa er greie moal.
core-start-retry = Prowal reesht
saved-state-unavailable = Cha row dty obbyr sauailt abyl dy ve laadit.
