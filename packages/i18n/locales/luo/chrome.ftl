# Luo viewer chrome: buttons, panel headers, and other UI the reader interacts
# with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the `ng'` apostrophe convention and for what a
# speaker should check first.


## Answer submission

answer-checking = Inono…
answer-submitting = Ior…
answer-checking-status = Duoko inono
answer-submitting-status = Duoko ior
answer-correct = Kare
answer-incorrect = Ok kare
answer-response-saved = Duoko Okan
answer-percent-credit = { $percent }% mar Point
answer-percent-correct = { $percent }% Kare
answer-percent-short = { $percent } %
max-credit-available = Point maduong'ie moloyo: { $percent }%
attempts-remaining =
    { $count ->
        [0] onge tem modong'
        [one] odong' tem { $count }
       *[other] odong' tem { $count }
    }
validation-correct = (Kare)
validation-incorrect = (Ok kare)
validation-partially-correct = (Kare e bathe moko)
answer-show-responses =
    { $count ->
        [one] Nyis duoko { $count } mar { $answerId }
       *[other] Nyis duoko { $count } mar { $answerId }
    }

## Disclosure panels

feedback-heading = Paro
collapsible-click-to-open = (dii mondo iyaw)
collapsible-click-to-close = (dii mondo iumo)
collapsible-initializing = Ichako…
footnote-show = Nyis ndiko mar piny
footnote-hide = Pand ndiko mar piny
description-more-information = weche momedore

## Controls

slider-previous = Mokalo
slider-next = Maluwo
keyboard-open = Yaw Kibod
keyboard-close = Um Kibod
choice-input-remove-choice = Gol { $choice }
matrix-remove-row = Gol laini
matrix-add-row = Med laini
matrix-remove-column = Gol siro
matrix-add-column = Med siro
subset-add-remove-points = Med/Gol tong'
subset-toggle-points-intervals = Lok tong' gi kind
subset-move-points = Yieng' Tong'
subset-clear = Ruch
orbital-add-row = Med Laini
orbital-remove-row = Gol Laini
orbital-add-box = Med Sanduku
orbital-remove-box = Gol Sanduku
orbital-add-up-arrow = Med Asere Modhi Malo
orbital-add-down-arrow = Med Asere Modhi Piny
orbital-remove-arrow = Gol Asere
orbital-row-label = Nying laini { $row }
pretzel-answer = Duoko

## Math input

math-input-preview-region = neno motelo mar wach kwan
math-input-preview = Neno motelo
math-input-invalid-expression = Wach ma ok kare:

## Document status

viewer-initializing = Ichako…

## Errors

error-heading = Bayo
error-found-at =
    { $span ->
        [line] Oyudi e laini mar { $startLine }.
       *[lines] Oyudi e laini mag { $startLine }–{ $endLine }.
    }
document-contains-errors = Ndikoni nigi bayo!
diagnostic-heading-error = Bayo
diagnostic-heading-warning = Siem
diagnostic-heading-information = Weche
diagnostic-heading-hint = Ranyisi
accessibility-heading-level-1 = Ketho Chik mar WCAG AA mar Chopo
accessibility-heading-level-2 = Siem mar chopo
something-went-wrong = Nitie gima ok odhi maber.
renderer-load-failed = janyis okier chako. Kiyie chak ich kendo.
core-start-failed = Janyis mar ndiko okier chako. Kiyie chak ich kendo.
