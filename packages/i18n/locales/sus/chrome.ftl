# Susu viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Susu (ISO 639-3 `sus`) is Central Mande, Soso-Jalonke branch, spoken mainly
# in Guinea with communities across the Sierra Leone and Guinea-Bissau
# borders. It is the fourth Mande catalog in this batch — after `bm`
# (Bambara), `dyu` (Dyula) and `mnk` (Mandinka) — and, like all three, it
# forks on neither `$gender` nor `$role` in `content.ftl`: Susu has no
# noun-class or gender agreement, so an adjective describing a "thick red
# line" takes the same shape whatever it modifies. See `content.ftl`'s header
# for what Susu marks a description with instead, and for the chemistry note.
#
# A speaker should check the secondary style colors first (`gray`, `orange`,
# `purple`, `pink`, `brown`, `cyan`), which this seed borrows from French —
# Guinea's language of schooling and administration — rather than guessing at
# native Susu terms it is not confident of.


## Answer submission

answer-checking = A ki matoxin na…
answer-submitting = A ki rasa na…
answer-checking-status = Yabi matoxin na
answer-submitting-status = Yabi rasa na
answer-correct = A tonyi
answer-incorrect = A mu tonyi ra
answer-response-saved = Yabi mara
answer-percent-credit = { $percent }% kerediti
answer-percent-correct = { $percent }% tonyi
answer-percent-short = { $percent } %
max-credit-available = Kerediti gbeenyi ki soto la: { $percent }%
attempts-remaining =
    { $count ->
        [0] katu mu to
        [one] katu { $count } to
       *[other] katu { $count } to
    }
validation-correct = (A tonyi)
validation-incorrect = (A mu tonyi ra)
validation-partially-correct = (A tonyi a dɔxɔn na)
answer-show-responses =
    { $count ->
        [one] Yabi { $count } yitandi { $answerId } ma
       *[other] Yabi { $count } nde yitandi { $answerId } ma
    }

## Disclosure panels

feedback-heading = Raxidi
collapsible-click-to-open = (a mati a ki raba)
collapsible-click-to-close = (a mati a ki soxo)
collapsible-initializing = A dati na…
footnote-show = Bɔɲɛnyi safari yitandi
footnote-hide = Bɔɲɛnyi safari maxa
description-more-information = kibari fari

## Controls

slider-previous = Naxan tɛmɛn
slider-next = Naxan fa
keyboard-open = Kibɔɔdi raba
keyboard-close = Kibɔɔdi soxo
choice-input-remove-choice = { $choice } bo
matrix-remove-row = Sira bo
matrix-add-row = Sira lafan
matrix-remove-column = Kolɔn bo
matrix-add-column = Kolɔn lafan
subset-add-remove-points = Tonbondiye lafan/bo
subset-toggle-points-intervals = Tonbondiye nun sinsanyie mafalin
subset-move-points = Tonbondiye maamandi
subset-clear = Bɛɛ bo
orbital-add-row = Sira lafan
orbital-remove-row = Sira bo
orbital-add-box = Kɛsu lafan
orbital-remove-box = Kɛsu bo
orbital-add-up-arrow = Fari kalabɛnyi lafan
orbital-add-down-arrow = Bun kalabɛnyi lafan
orbital-remove-arrow = Kalabɛnyi bo
orbital-row-label = Sira { $row } xili
pretzel-answer = Yabi

## Math input

math-input-preview-region = konti kumakan raxansen
math-input-preview = Raxansen
math-input-invalid-expression = Kumakan mu tonyi ra:

## Document status

viewer-initializing = A dati na…

## Errors

error-heading = Fili
error-found-at =
    { $span ->
        [line] A tofa sira { $startLine } ma.
       *[lines] A tofa sirae { $startLine }–{ $endLine } ma.
    }
document-contains-errors = Kitabuyi sɔtɔ fili nde ra!
diagnostic-heading-error = Fili
diagnostic-heading-warning = Dangaxun
diagnostic-heading-information = Kibari
diagnostic-heading-hint = Malaxidi
accessibility-heading-level-1 = WCAG AA futandiyi tɛmɛn
accessibility-heading-level-2 = Futandiyi dangaxun
something-went-wrong = Fɛn mu naxɛ a lanyi ra.
renderer-load-failed = yitandirilai mu fa. I ki karati murundi.
core-start-failed = Kitabuyi yitandirilai mu dati. I ki karati murundi.
