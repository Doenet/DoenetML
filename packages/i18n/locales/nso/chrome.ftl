# Northern Sotho viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the naming note — `nso` is Sesotho sa Leboa,
# also called Sepedi — and for what a speaker should check first.


## Answer submission

answer-checking = Go lekolwa…
answer-submitting = Go romelwa…
answer-checking-status = Karabo e a lekolwa
answer-submitting-status = Karabo e a romelwa
answer-correct = E nepagetše
answer-incorrect = Ga se ya nepagala
answer-response-saved = Karabo e Bolokilwe
answer-percent-credit = { $percent }% ya Meputso
answer-percent-correct = { $percent }% e Nepagetše
answer-percent-short = { $percent } %
max-credit-available = Meputso ye kgolo yeo e lego gona: { $percent }%
attempts-remaining =
    { $count ->
        [0] ga go na maiteko a šetšego
        [one] go šetše maiteko a { $count }
       *[other] go šetše maiteko a { $count }
    }
validation-correct = (E nepagetše)
validation-incorrect = (Ga se ya nepagala)
validation-partially-correct = (E nepagetše ka seripa)
answer-show-responses =
    { $count ->
        [one] Bontšha karabo e { $count } go { $answerId }
       *[other] Bontšha dikarabo tše { $count } go { $answerId }
    }

## Disclosure panels

feedback-heading = Tshwaotshwao
collapsible-click-to-open = (kgotla go bula)
collapsible-click-to-close = (kgotla go tswalela)
collapsible-initializing = Go thongwa…
footnote-show = Bontšha lengwalo la ka tlase
footnote-hide = Uta lengwalo la ka tlase
description-more-information = tshedimošo ye nngwe

## Controls

slider-previous = Pele
slider-next = Latelago
keyboard-open = Bula Khiiboto
keyboard-close = Tswalela Khiiboto
choice-input-remove-choice = Tloša { $choice }
matrix-remove-row = Tloša mothaladi
matrix-add-row = Oketša mothaladi
matrix-remove-column = Tloša kholomo
matrix-add-column = Oketša kholomo
subset-add-remove-points = Oketša/Tloša dintlha
subset-toggle-points-intervals = Fetola dintlha le dikgao
subset-move-points = Šuthiša Dintlha
subset-clear = Phumola
orbital-add-row = Oketša Mothaladi
orbital-remove-row = Tloša Mothaladi
orbital-add-box = Oketša Lepokisi
orbital-remove-box = Tloša Lepokisi
orbital-add-up-arrow = Oketša Mosebe wa Godimo
orbital-add-down-arrow = Oketša Mosebe wa Tlase
orbital-remove-arrow = Tloša Mosebe
orbital-row-label = Leina la mothaladi wa { $row }
pretzel-answer = Karabo

## Math input

math-input-preview-region = ponelopele ya polelwana ya dipalo
math-input-preview = Ponelopele
math-input-invalid-expression = Polelwana ye e fošagetšego:

## Document status

viewer-initializing = Go thongwa…

## Errors

error-heading = Phošo
error-found-at =
    { $span ->
        [line] E hweditšwe mothalading wa { $startLine }.
       *[lines] E hweditšwe methalading ya { $startLine }–{ $endLine }.
    }
document-contains-errors = Tokumente ye e na le diphošo!
diagnostic-heading-error = Phošo
diagnostic-heading-warning = Temošo
diagnostic-heading-information = Tshedimošo
diagnostic-heading-hint = Keletšo
accessibility-heading-level-1 = Tlolo ya WCAG AA ya Phihlelelo
accessibility-heading-level-2 = Temošo ya phihlelelo
something-went-wrong = Go na le se se sa sepelago gabotse.
renderer-load-failed = mmontšhi o palelwe go laisa. Hle laiša letlakala gape.
core-start-failed = Mmontšhi wa tokumente ga se a kgone go thoma. Hle laiša letlakala gape.
