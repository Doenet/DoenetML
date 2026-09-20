# Tsonga viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for how narrow this catalog's class fork is and
# why, and for what a speaker should check first.


## Answer submission

answer-checking = Ku kambeliwa…
answer-submitting = Ku rhumeriwa…
answer-checking-status = Nhlamulo ya kambeliwa
answer-submitting-status = Nhlamulo ya rhumeriwa
answer-correct = Swi lulamile
answer-incorrect = A swi lulamanga
answer-response-saved = Nhlamulo yi Hlayisiwile
answer-percent-credit = { $percent }% wa Tinhlayo
answer-percent-correct = { $percent }% swi Lulamile
answer-percent-short = { $percent } %
max-credit-available = Tinhlayo letikulu leti kumekaka: { $percent }%
attempts-remaining =
    { $count ->
        [0] a ku na ku ringeta loku saleke
        [one] ku sale ku ringeta ka { $count }
       *[other] ku sale ku ringeta ka { $count }
    }
validation-correct = (Swi lulamile)
validation-incorrect = (A swi lulamanga)
validation-partially-correct = (Swi lulamile hi xiphemu)
answer-show-responses =
    { $count ->
        [one] Kombisa nhlamulo { $count } eka { $answerId }
       *[other] Kombisa tinhlamulo { $count } eka { $answerId }
    }

## Disclosure panels

feedback-heading = Nhlamulo ya Mudyondzisi
collapsible-click-to-open = (tshikilela ku pfula)
collapsible-click-to-close = (tshikilela ku pfala)
collapsible-initializing = Ku sungula…
footnote-show = Kombisa xitsundzuxo xa le hansi
footnote-hide = Tumbeta xitsundzuxo xa le hansi
description-more-information = vuxokoxoko lebyin'wana

## Controls

slider-previous = Leswi hundzeke
slider-next = Leswi landzelaka
keyboard-open = Pfula Khibodo
keyboard-close = Pfala Khibodo
choice-input-remove-choice = Susa { $choice }
matrix-remove-row = Susa ntila
matrix-add-row = Engetela ntila
matrix-remove-column = Susa khumbi
matrix-add-column = Engetela khumbi
subset-add-remove-points = Engetela/Susa tipoyinti
subset-toggle-points-intervals = Cinca tipoyinti ni swikhati
subset-move-points = Susumeta Tipoyinti
subset-clear = Sula
orbital-add-row = Engetela Ntila
orbital-remove-row = Susa Ntila
orbital-add-box = Engetela Bokisi
orbital-remove-box = Susa Bokisi
orbital-add-up-arrow = Engetela Nseve wa le Henhla
orbital-add-down-arrow = Engetela Nseve wa le Hansi
orbital-remove-arrow = Susa Nseve
orbital-row-label = Vito ra ntila { $row }
pretzel-answer = Nhlamulo

## Math input

math-input-preview-region = ku languta ka xivulwa xa tinhlayo
math-input-preview = Ku languta
math-input-invalid-expression = Xivulwa lexi hoxeke:

## Document status

viewer-initializing = Ku sungula…

## Errors

error-heading = Xihoxo
error-found-at =
    { $span ->
        [line] Xi kumeke eka layini { $startLine }.
       *[lines] Xi kumeke eka tilayini { $startLine }–{ $endLine }.
    }
document-contains-errors = Tsalwa leri ri na swihoxo!
diagnostic-heading-error = Xihoxo
diagnostic-heading-warning = Xilemukiso
diagnostic-heading-information = Vuxokoxoko
diagnostic-heading-hint = Xiletelo
accessibility-heading-level-1 = Ku Tluriwa ka WCAG AA ka Ku Fikeleleka
accessibility-heading-level-2 = Xilemukiso xa ku fikeleleka
something-went-wrong = Ku na leswi nga fambangiki kahle.
renderer-load-failed = xikombisi a xi kotanga ku layicha. Hi kombela u layicha tluka nakambe.
core-start-failed = Xikombisi xa tsalwa a xi kotanga ku sungula. Hi kombela u layicha tluka nakambe.
