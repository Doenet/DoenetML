# Mooré viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the suffixed class concord — the second family
# here to spell agreement at the end of the word — and for what a speaker
# should check first.


## Answer submission

answer-checking = Gesgo…
answer-submitting = Tʋʋbgo…
answer-checking-status = B gesda leoorã
answer-submitting-status = B tʋmda leoorã
answer-correct = Yaa sɩda
answer-incorrect = Pa sɩda ye
answer-response-saved = B baka leoorã
answer-percent-credit = { $percent }% poẽ
answer-percent-correct = { $percent }% sɩda
answer-percent-short = { $percent } %
max-credit-available = Poẽ wʋsg sẽn beẽ: { $percent }%
attempts-remaining =
    { $count ->
        [0] makr baa a ye ka be ye
        [one] makr { $count } n ket
       *[other] makr { $count } n ket
    }
validation-correct = (Yaa sɩda)
validation-incorrect = (Pa sɩda ye)
validation-partially-correct = (Yaa sɩda babg pʋgẽ)
answer-show-responses =
    { $count ->
        [one] Wilg leoor { $count } sẽn kẽed { $answerId }
       *[other] Wilg leoor { $count } sẽn kẽed { $answerId }
    }

## Disclosure panels

feedback-heading = Leoor-noor
collapsible-click-to-open = (nams n pak)
collapsible-click-to-close = (nams n pag)
collapsible-initializing = Sɩngre…
footnote-show = Wilg tẽngr gũusgã
footnote-hide = Solg tẽngr gũusgã
description-more-information = kibar a taab

## Controls

slider-previous = Sẽn looge
slider-next = Sẽn pʋgende
keyboard-open = Pak Klaviɛɛr
keyboard-close = Pag Klaviɛɛr
choice-input-remove-choice = Yiis { $choice }
matrix-remove-row = Yiis sõore
matrix-add-row = Paas sõore
matrix-remove-column = Yiis kolon
matrix-add-column = Paas kolon
subset-add-remove-points = Paas/Yiis poẽ rãmba
subset-toggle-points-intervals = Tek poẽ rãmb ne babs
subset-move-points = Vees Poẽ rãmba
subset-clear = Yiis fãa
orbital-add-row = Paas Sõore
orbital-remove-row = Yiis Sõore
orbital-add-box = Paas Kogend
orbital-remove-box = Yiis Kogend
orbital-add-up-arrow = Paas Peb sẽn kẽng zug
orbital-add-down-arrow = Paas Peb sẽn kẽng tẽngre
orbital-remove-arrow = Yiis Peb
orbital-row-label = Sõor { $row } yʋʋre
pretzel-answer = Leoore

## Math input

math-input-preview-region = sõdb goam gesg pĩnda
math-input-preview = Gesg pĩnda
math-input-invalid-expression = Goam sẽn pa zems:

## Document status

viewer-initializing = Sɩngre…

## Errors

error-heading = Kongre
error-found-at =
    { $span ->
        [line] B yãa sõor { $startLine } zug.
       *[lines] B yãa sõor { $startLine }–{ $endLine } zug.
    }
document-contains-errors = Sebrã tara kongre!
diagnostic-heading-error = Kongre
diagnostic-heading-warning = Keoogre
diagnostic-heading-information = Kibare
diagnostic-heading-hint = Bãnde
accessibility-heading-level-1 = WCAG AA tõog-paoodg kongre
accessibility-heading-level-2 = Tõog-paoodg keoogre
something-went-wrong = Bũmb n pa zems ye.
renderer-load-failed = wilgdã pa ta ye. Bɩ y le pak seb-nengã.
core-start-failed = Sebrã wilgd pa sɩng ye. Bɩ y le pak seb-nengã.
