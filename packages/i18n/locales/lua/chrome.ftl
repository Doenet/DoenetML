# Luba-Lulua viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the noun-class table and for what a speaker
# should check first.


## Answer submission

answer-checking = Tudi tutangila…
answer-submitting = Tudi tutuma…
answer-checking-status = Diandamuna didi ditangilibua
answer-submitting-status = Diandamuna didi ditumibua
answer-correct = Mmimpe
answer-incorrect = Kammimpe
answer-response-saved = Diandamuna Dilamibue
answer-percent-credit = { $percent }% ya Manganyi
answer-percent-correct = { $percent }% Mmimpe
answer-percent-short = { $percent } %
max-credit-available = Manganyi a bungi adiku: { $percent }%
attempts-remaining =
    { $count ->
        [0] katuena ne diteta didi dishala
        [one] kudi diteta { $count } didi dishala
       *[other] kudi mateta { $count } adi ashala
    }
validation-correct = (Mmimpe)
validation-incorrect = (Kammimpe)
validation-partially-correct = (Mmimpe ku citupa)
answer-show-responses =
    { $count ->
        [one] Leja diandamuna { $count } kudi { $answerId }
       *[other] Leja mandamuna { $count } kudi { $answerId }
    }

## Disclosure panels

feedback-heading = Dilumbuluisha
collapsible-click-to-open = (kanda bua kubulula)
collapsible-click-to-close = (kanda bua kukanga)
collapsible-initializing = Tudi tutuadija…
footnote-show = Leja cifundilu cia kuinshi
footnote-hide = Sokoka cifundilu cia kuinshi
description-more-information = ngumu mikuabo

## Controls

slider-previous = Cidi kumpala
slider-next = Cidi kunyima
keyboard-open = Bulula Klavie
keyboard-close = Kanga Klavie
choice-input-remove-choice = Umbusha { $choice }
matrix-remove-row = Umbusha mulongo
matrix-add-row = Bueja mulongo
matrix-remove-column = Umbusha mutshi
matrix-add-column = Bueja mutshi
subset-add-remove-points = Bueja/Umbusha mpwente
subset-toggle-points-intervals = Shintulula mpwente ne bitupa
subset-move-points = Nyemesha Mpwente
subset-clear = Umbusha bionso
orbital-add-row = Bueja Mulongo
orbital-remove-row = Umbusha Mulongo
orbital-add-box = Bueja Kasandu
orbital-remove-box = Umbusha Kasandu
orbital-add-up-arrow = Bueja Kasonga ka Kuulu
orbital-add-down-arrow = Bueja Kasonga ka Kuinshi
orbital-remove-arrow = Umbusha Kasonga
orbital-row-label = Dina dia mulongo { $row }
pretzel-answer = Diandamuna

## Math input

math-input-preview-region = ditangila kumpala dia mbalu
math-input-preview = Ditangila kumpala
math-input-invalid-expression = Diambila kadidi dimpe:

## Document status

viewer-initializing = Tudi tutuadija…

## Errors

error-heading = Dipanga
error-found-at =
    { $span ->
        [line] Didi disangana ku mulongo { $startLine }.
       *[lines] Didi disangana ku milongo { $startLine }–{ $endLine }.
    }
document-contains-errors = Mukanda eu udi ne mapanga!
diagnostic-heading-error = Dipanga
diagnostic-heading-warning = Didimuija
diagnostic-heading-information = Ngumu
diagnostic-heading-hint = Cimanyinu
accessibility-heading-level-1 = Dipita dia WCAG AA dia Difikila
accessibility-heading-level-2 = Didimuija dia difikila
something-went-wrong = Kudi cintu kacienza bimpe.
renderer-load-failed = mulejianyi kavua mufike. Tuasakidila pingaja dibeji.
core-start-failed = Mulejianyi wa mukanda kavua mutuadije. Tuasakidila pingaja dibeji.
