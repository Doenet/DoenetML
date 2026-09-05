# Setswana viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Setswana has two plural categories, and a noun marks number with a class
# prefix rather than a suffix — «teko» one attempt, «diteko» several; «karabo»
# one answer, «dikarabo» several — and it keeps doing so after a numeral. So
# the selects are kept and the noun changes shape inside them.
# `attempts-remaining` also keeps its `[0]` branch, an exact-value match rather
# than a plural category, which says «ga go na» instead of counting to zero.


## Answer submission

answer-checking = E a tlhatlhoba...
answer-submitting = E a romela...
answer-checking-status = E tlhatlhoba karabo
answer-submitting-status = E romela karabo
answer-correct = E siame
answer-incorrect = Ga e a siama
answer-response-saved = Karabo e Bolokilwe
answer-percent-credit = Matshwao { $percent }%
answer-percent-correct = { $percent }% E siame
answer-percent-short = { $percent } %
max-credit-available = Matshwao a magolo a a leng teng: { $percent }%
attempts-remaining =
    { $count ->
        [0] ga go na teko e e setseng
        [one] teko e le { $count } e setse
       *[other] diteko tse { $count } di setse
    }
validation-correct = (E siame)
validation-incorrect = (Ga e a siama)
validation-partially-correct = (E siame ka bontlhanngwe)
answer-show-responses =
    { $count ->
        [one] Bontsha karabo e le { $count } ya { $answerId }
       *[other] Bontsha dikarabo tse { $count } tsa { $answerId }
    }

## Disclosure panels

feedback-heading = Kakgelo
collapsible-click-to-open = (tobetsa go bula)
collapsible-click-to-close = (tobetsa go tswala)
collapsible-initializing = E a simolola...
footnote-show = Bontsha tlhaloso ya kwa tlase
footnote-hide = Fitlha tlhaloso ya kwa tlase
description-more-information = tshedimosetso e nngwe

## Controls

slider-previous = E e fetileng
slider-next = E e latelang
keyboard-open = Bula Keyboard
keyboard-close = Tswala Keyboard
choice-input-remove-choice = Ntsha { $choice }
matrix-remove-row = Ntsha mola o o rapameng
matrix-add-row = Oketsa mola o o rapameng
matrix-remove-column = Ntsha mola o o emeng
matrix-add-column = Oketsa mola o o emeng
subset-add-remove-points = Oketsa/Ntsha dintlha
subset-toggle-points-intervals = Fetola fa gare ga dintlha le dikgaoganyo
subset-move-points = Sutisa Dintlha
subset-clear = Phimola
# A `box` here is one orbital, drawn as a square: «lebokoso».
orbital-add-row = Oketsa Mola
orbital-remove-row = Ntsha Mola
orbital-add-box = Oketsa Lebokoso
orbital-remove-box = Ntsha Lebokoso
orbital-add-up-arrow = Oketsa Sekai se se Lebileng Godimo
orbital-add-down-arrow = Oketsa Sekai se se Lebileng Tlase
orbital-remove-arrow = Ntsha Sekai
orbital-row-label = Leina la mola { $row }
pretzel-answer = Karabo

## Math input

math-input-preview-region = ponelopele ya polelo ya dipalo
math-input-preview = Ponelopele
math-input-invalid-expression = Polelo ga e a siama:

## Document status

viewer-initializing = E a simolola...

## Errors

error-heading = Phoso
error-found-at =
    { $span ->
        [line] E fitlhetswe mo moleng wa { $startLine }.
       *[lines] E fitlhetswe mo melaneng ya { $startLine }–{ $endLine }.
    }
document-contains-errors = Lokwalo lo lo na le diphoso!
diagnostic-heading-error = Phoso
diagnostic-heading-warning = Tlhagiso
diagnostic-heading-information = Tshedimosetso
diagnostic-heading-hint = Kgakololo
accessibility-heading-level-1 = Tlolo ya WCAG AA ya Tsenogo
accessibility-heading-level-2 = Tlhagiso ya tsenogo
something-went-wrong = Go na le se se sa tsamayang sentle.
renderer-load-failed = mmontshi o le mongwe ga o a kgona go tsena. Tsweetswee ntshafatsa tsebe.
core-start-failed = Mmontshi wa lokwalo ga a a kgona go simolola. Tsweetswee ntshafatsa tsebe.
