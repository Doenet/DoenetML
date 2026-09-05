# Mandinka viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the definite suffix, for why `man` negotiates
# here rather than to `locales/bm` or `locales/dyu`, and for what a speaker
# should check first.


## Answer submission

answer-checking = Koroosiroo be keriŋ…
answer-submitting = Kiiroo be keriŋ…
answer-checking-status = Jaabiroo be koroosi kaŋ
answer-submitting-status = Jaabiroo be kii kaŋ
answer-correct = A benta
answer-incorrect = A maŋ beŋ
answer-response-saved = Jaabiroo maabota
answer-percent-credit = { $percent }% poyintoolu
answer-percent-correct = { $percent }% benta
answer-percent-short = { $percent } %
max-credit-available = Poyint jamaa meŋ be sotoo la: { $percent }%
attempts-remaining =
    { $count ->
        [0] kata te tu la
        [one] kata { $count } tuta
       *[other] kata { $count } tuta
    }
validation-correct = (A benta)
validation-incorrect = (A maŋ beŋ)
validation-partially-correct = (A benta karoo doo la)
answer-show-responses =
    { $count ->
        [one] Jaabiroo { $count } yitandi { $answerId } ye
       *[other] Jaabiroo { $count } yitandi { $answerId } ye
    }

## Disclosure panels

feedback-heading = Yaamaroo
collapsible-click-to-open = (a bito ka a yele)
collapsible-click-to-close = (a bito ka a soroŋ)
collapsible-initializing = A be dati kaŋ…
footnote-show = Duuma safeeroo yitandi
footnote-hide = Duuma safeeroo maabo
description-more-information = kibaari doolu

## Controls

slider-previous = Meŋ tambita
slider-next = Meŋ ka naa
keyboard-open = Kiiboodoo Yele
keyboard-close = Kiiboodoo Soroŋ
choice-input-remove-choice = { $choice } bondi
matrix-remove-row = Laayinoo bondi
matrix-add-row = Laayinoo lafaa
matrix-remove-column = Kolonoo bondi
matrix-add-column = Kolonoo lafaa
subset-add-remove-points = Tombondiŋolu lafaa/bondi
subset-toggle-points-intervals = Tombondiŋolu niŋ tembendiroolu faliŋ
subset-move-points = Tombondiŋolu Maamandi
subset-clear = Bee bondi
orbital-add-row = Laayinoo Lafaa
orbital-remove-row = Laayinoo Bondi
orbital-add-box = Keesoo Lafaa
orbital-remove-box = Keesoo Bondi
orbital-add-up-arrow = Santo Kalabeñoo Lafaa
orbital-add-down-arrow = Duuma Kalabeñoo Lafaa
orbital-remove-arrow = Kalabeñoo Bondi
orbital-row-label = Laayinoo { $row } too
pretzel-answer = Jaabiroo

## Math input

math-input-preview-region = konteroo kumakaŋ juubeeri foloo
math-input-preview = Juubeeri foloo
math-input-invalid-expression = Kumakaŋ kuruŋo:

## Document status

viewer-initializing = A be dati kaŋ…

## Errors

error-heading = Filoo
error-found-at =
    { $span ->
        [line] A jeta laayinoo { $startLine } to.
       *[lines] A jeta laayinoolu { $startLine }–{ $endLine } to.
    }
document-contains-errors = Ñiŋ kitaaboo ye filoolu soto!
diagnostic-heading-error = Filoo
diagnostic-heading-warning = Dandalaaroo
diagnostic-heading-information = Kibaaroo
diagnostic-heading-hint = Yitandiroo
accessibility-heading-level-1 = WCAG AA futandiroo tambiroo
accessibility-heading-level-2 = Futandiroo dandalaaroo
something-went-wrong = Feŋ ne maŋ ke a ñaama.
renderer-load-failed = yitandirilaa maŋ futa. Dukare, karataa murundi.
core-start-failed = Kitaaboo yitandirilaa maŋ dati. Dukare, karataa murundi.
