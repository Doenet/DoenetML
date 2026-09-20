# Tok Pisin viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Tok Pisin is the one locale in this batch that is **not Austronesian**: it is
# an English-lexified creole and the lingua franca of Papua New Guinea, with a
# grammar of its own that its English vocabulary does not predict. The trap for
# a corrector is exactly that: a word here looks like an English word and is not
# one, so «gutpela» is not "good fellow" and «long» is not "long".
#
# Written in the standard orthography of PNG publishing (Wantok, Buk Baibel),
# which spells the language phonemically — «bilong», «tasol», «painim» — rather
# than after the English words behind them.
#
# Tok Pisin marks no number on the noun: the plural is «ol» before it, and a
# noun after a numeral stays as it is. So a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped. A `[0]` branch stays wherever English has one.


## Answer submission

answer-checking = Skelim i stap…
answer-submitting = Salim i stap…
answer-checking-status = Skelim bekim
answer-submitting-status = Salim bekim
answer-correct = Stret
answer-incorrect = I no stret
answer-response-saved = Bekim i stap sef
answer-percent-credit = { $percent }% mak
answer-percent-correct = { $percent }% stret
answer-percent-short = { $percent } %
max-credit-available = Bikpela mak yu inap kisim: { $percent }%
# No select: «traim» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] i no gat traim i stap yet
       *[other] { $count } traim i stap yet
    }
validation-correct = (Stret)
validation-incorrect = (I no stret)
validation-partially-correct = (Stret liklik)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Soim { $count } bekim bilong { $answerId }

## Disclosure panels

feedback-heading = Toktok bek
collapsible-click-to-open = (klikim bilong opim)
collapsible-click-to-close = (klikim bilong pasim)
collapsible-initializing = Kirapim i stap…
footnote-show = Soim footnote
footnote-hide = Haitim footnote
description-more-information = moa tok save

## Controls

slider-previous = Bipo
slider-next = Neks
keyboard-open = Opim kibot
keyboard-close = Pasim kibot
choice-input-remove-choice = Rausim { $choice }
matrix-remove-row = Rausim lain
matrix-add-row = Putim wanpela lain
matrix-remove-column = Rausim kolam
matrix-add-column = Putim wanpela kolam
subset-add-remove-points = Putim/Rausim ol poin
subset-toggle-points-intervals = Senisim ol poin na ol namel
subset-move-points = Muvim ol poin
subset-clear = Klinim
orbital-add-row = Putim wanpela lain
orbital-remove-row = Rausim lain
orbital-add-box = Putim wanpela bokis
orbital-remove-box = Rausim bokis
orbital-add-up-arrow = Putim wanpela spia i go antap
orbital-add-down-arrow = Putim wanpela spia i go daun
orbital-remove-arrow = Rausim spia
orbital-row-label = Nem bilong lain { $row }
pretzel-answer = Bekim

## Math input

math-input-preview-region = lukluk pastaim long tok matematik
math-input-preview = Lukluk pastaim
math-input-invalid-expression = Tok i no stret:

## Document status

viewer-initializing = Kirapim i stap…

## Errors

error-heading = Asua
error-found-at =
    { $span ->
        [line] Painim long lain { $startLine }.
       *[lines] Painim long ol lain { $startLine }–{ $endLine }.
    }
document-contains-errors = Dispela dokumen i gat asua!
diagnostic-heading-error = Asua
diagnostic-heading-warning = Tok lukaut
diagnostic-heading-information = Tok save
diagnostic-heading-hint = Tok helpim
accessibility-heading-level-1 = Brukim lo bilong akses WCAG AA
accessibility-heading-level-2 = Tok lukaut long akses
something-went-wrong = Wanpela samting i no orait.
renderer-load-failed = wanpela renderer i no lodim. Plis lodim gen dispela pes.
core-start-failed = Luk bilong dokumen i no inap kirap. Plis lodim gen dispela pes.
