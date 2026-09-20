# Nigerian Pidgin viewer chrome: buttons, panel headers, and other UI the
# reader interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the grammar this catalog turns on, for what
# separates it from `locales/kri`, and for what a speaker should check first.
# The short version: read these aloud. The vocabulary is English and the
# grammar is not.


## Answer submission

answer-checking = Dey chẹk…
answer-submitting = Dey sẹnd…
answer-checking-status = Wi dey chẹk di ansa
answer-submitting-status = Wi dey sẹnd di ansa
answer-correct = E korẹkt
answer-incorrect = E no korẹkt
answer-response-saved = Wi Don Sev Yọ Ansa
answer-percent-credit = { $percent }% Krẹdit
answer-percent-correct = { $percent }% Korẹkt
answer-percent-short = { $percent } %
max-credit-available = Di mọst krẹdit wey yu fit gẹt: { $percent }%
attempts-remaining =
    { $count ->
        [0] no tray rẹmen
        [one] { $count } tray rẹmen
       *[other] { $count } tray rẹmen
    }
validation-correct = (E korẹkt)
validation-incorrect = (E no korẹkt)
validation-partially-correct = (E korẹkt smọl)
answer-show-responses =
    { $count ->
        [one] Sho { $count } ansa fọ { $answerId }
       *[other] Sho { $count } ansa fọ { $answerId }
    }

## Disclosure panels

feedback-heading = Fidbak
collapsible-click-to-open = (klik make e opin)
collapsible-click-to-close = (klik make e klos)
collapsible-initializing = E dey stat…
footnote-show = Sho di fut-not
footnote-hide = Haid di fut-not
description-more-information = mọ infọmeshọn

## Controls

slider-previous = Wan Wey Pass
slider-next = Nẹks
keyboard-open = Opin Kibọd
keyboard-close = Klos Kibọd
choice-input-remove-choice = Rimuv { $choice }
matrix-remove-row = Rimuv ro
matrix-add-row = Add ro
matrix-remove-column = Rimuv kọlum
matrix-add-column = Add kọlum
subset-add-remove-points = Add/Rimuv point dem
subset-toggle-points-intervals = Switch bitwin point an intaval
subset-move-points = Muv Point Dem
subset-clear = Kliar
orbital-add-row = Add Ro
orbital-remove-row = Rimuv Ro
orbital-add-box = Add Bọks
orbital-remove-box = Rimuv Bọks
orbital-add-up-arrow = Add Aro Wey Fes Ọp
orbital-add-down-arrow = Add Aro Wey Fes Daun
orbital-remove-arrow = Rimuv Aro
orbital-row-label = Nem fọ ro { $row }
pretzel-answer = Ansa

## Math input

math-input-preview-region = privyu of di mat ẹkspreshọn
math-input-preview = Privyu
math-input-invalid-expression = Ẹkspreshọn wey no korẹkt:

## Document status

viewer-initializing = E dey stat…

## Errors

error-heading = Ẹra
error-found-at =
    { $span ->
        [line] Wi si am fọ lain { $startLine }.
       *[lines] Wi si am fọ lain { $startLine }–{ $endLine }.
    }
document-contains-errors = Dis dọkyumẹnt gẹt ẹra insai am!
diagnostic-heading-error = Ẹra
diagnostic-heading-warning = Wọnin
diagnostic-heading-information = Infọ
diagnostic-heading-hint = Hint
accessibility-heading-level-1 = WCAG AA Aksẹsibiliti Vayolashọn
accessibility-heading-level-2 = Aksẹsibiliti alat
something-went-wrong = Sọmtin no go wẹl.
renderer-load-failed = wan rẹndara no lod. Abeg rilod di pej.
core-start-failed = Di dọkyumẹnt viwa no fit stat. Abeg rilod di pej.
