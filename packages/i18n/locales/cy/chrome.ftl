# Welsh viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Welsh counts in six plural categories — `zero`, `one`, `two`, `few`, `many`
# and `other` — the most of any language this repository ships. A noun after a
# numeral stays singular; what varies is the mutation the numeral puts on it,
# which is why a counted message's branches differ in the first letter of the
# word and not in its ending. A noun that begins with a vowel cannot mutate, so
# all six branches would read alike and the select is dropped instead.


## Answer submission

answer-checking = Yn gwirio…
answer-submitting = Yn cyflwyno…
answer-checking-status = Yn gwirio'r ateb
answer-submitting-status = Yn cyflwyno'r ateb
answer-correct = Cywir
answer-incorrect = Anghywir
answer-response-saved = Ymateb wedi'i gadw
answer-percent-credit = { $percent }% o'r marciau
answer-percent-correct = { $percent }% yn gywir
answer-percent-short = { $percent } %
max-credit-available = Uchafswm y marciau sydd ar gael: { $percent }%
# The numeral decides the mutation on «cynnig»: «dau gynnig», «tri chynnig»,
# «chwe chynnig», and the radical everywhere else. `[0]` catches none by
# number, as the English does, so the `zero` category it would otherwise
# select is not written out.
attempts-remaining =
    { $count ->
        [0] dim cynnig ar ôl
        [one] { $count } cynnig ar ôl
        [two] { $count } gynnig ar ôl
        [few] { $count } chynnig ar ôl
        [many] { $count } chynnig ar ôl
       *[other] { $count } cynnig ar ôl
    }
validation-correct = (Cywir)
validation-incorrect = (Anghywir)
validation-partially-correct = (Yn rhannol gywir)
# «ar gyfer» rather than «i»: `i` softens the word after it, and the word
# after it here is an authored name the catalog never sees.
answer-show-responses = Dangos { $count } ymateb ar gyfer { $answerId }

## Disclosure panels

feedback-heading = Adborth
collapsible-click-to-open = (cliciwch i agor)
collapsible-click-to-close = (cliciwch i gau)
collapsible-initializing = Yn cychwyn…
footnote-show = Dangos y troednodyn
footnote-hide = Cuddio'r troednodyn
description-more-information = rhagor o wybodaeth

## Controls

slider-previous = Blaenorol
slider-next = Nesaf
keyboard-open = Agor y bysellfwrdd
keyboard-close = Cau'r bysellfwrdd
choice-input-remove-choice = Tynnu { $choice }
matrix-remove-row = Tynnu rhes
matrix-add-row = Ychwanegu rhes
matrix-remove-column = Tynnu colofn
matrix-add-column = Ychwanegu colofn
subset-add-remove-points = Ychwanegu/tynnu pwyntiau
subset-toggle-points-intervals = Newid rhwng pwyntiau a chyfyngau
subset-move-points = Symud y pwyntiau
subset-clear = Clirio
orbital-add-row = Ychwanegu rhes
orbital-remove-row = Tynnu rhes
orbital-add-box = Ychwanegu blwch
orbital-remove-box = Tynnu blwch
orbital-add-up-arrow = Ychwanegu saeth i fyny
orbital-add-down-arrow = Ychwanegu saeth i lawr
orbital-remove-arrow = Tynnu saeth
orbital-row-label = Label ar gyfer rhes { $row }
pretzel-answer = Ateb
# «ar gyfer» again, for the same reason: «o» would soften the column's name.

## Math input

math-input-preview-region = rhagolwg o'r mynegiad mathemategol
math-input-preview = Rhagolwg
math-input-invalid-expression = Mynegiad annilys:

## Document status

viewer-initializing = Yn cychwyn…

## Errors

error-heading = Gwall
error-found-at =
    { $span ->
        [line] Wedi'i ganfod ar linell { $startLine }.
       *[lines] Wedi'i ganfod ar linellau { $startLine }–{ $endLine }.
    }
document-contains-errors = Mae gwallau yn y ddogfen hon!
diagnostic-heading-error = Gwall
diagnostic-heading-warning = Rhybudd
diagnostic-heading-information = Gwybodaeth
diagnostic-heading-hint = Awgrym
accessibility-heading-level-1 = Tramgwydd hygyrchedd WCAG AA
accessibility-heading-level-2 = Rhybudd hygyrchedd
something-went-wrong = Aeth rhywbeth o'i le.
renderer-load-failed = methodd rendrwr â llwytho. Ail-lwythwch y dudalen.
core-start-failed = Nid oedd modd cychwyn gwyliwr y ddogfen. Ail-lwythwch y dudalen.
