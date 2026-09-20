# Albanian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Albanian counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. `[0]` is
# still spelled out wherever English changes its wording for zero.
#
# Register: the second-person plural imperative — «Ringarkoni faqen».


## Answer submission

answer-checking = Po kontrollohet…
answer-submitting = Po dërgohet…
answer-checking-status = Kontrollimi i përgjigjes
answer-submitting-status = Dërgimi i përgjigjes
answer-correct = Saktë
answer-incorrect = Gabim
answer-response-saved = Përgjigjja u ruajt
answer-percent-credit = { $percent }% e pikëve
answer-percent-correct = { $percent }% saktë
answer-percent-short = { $percent } %
max-credit-available = Pikët më të larta të mundshme: { $percent }%
attempts-remaining =
    { $count ->
        [0] nuk ka më përpjekje
        [one] mbetet { $count } përpjekje
       *[other] mbeten { $count } përpjekje
    }
validation-correct = (Saktë)
validation-incorrect = (Gabim)
validation-partially-correct = (Pjesërisht saktë)
answer-show-responses =
    { $count ->
        [one] Shfaq { $count } përgjigje për { $answerId }
       *[other] Shfaq { $count } përgjigje për { $answerId }
    }

## Disclosure panels

feedback-heading = Kthim përgjigjeje
collapsible-click-to-open = (klikoni për ta hapur)
collapsible-click-to-close = (klikoni për ta mbyllur)
collapsible-initializing = Po niset…
footnote-show = Shfaq shënimin
footnote-hide = Fshih shënimin
description-more-information = më shumë informacion

## Controls

slider-previous = Prapa
slider-next = Përpara
keyboard-open = Hap tastierën
keyboard-close = Mbyll tastierën
choice-input-remove-choice = Hiq { $choice }
matrix-remove-row = Hiq rreshtin
matrix-add-row = Shto rresht
matrix-remove-column = Hiq shtyllën
matrix-add-column = Shto shtyllë
subset-add-remove-points = Shto/hiq pika
subset-toggle-points-intervals = Kalo midis pikave dhe intervaleve
subset-move-points = Zhvendos pikat
subset-clear = Pastro
orbital-add-row = Shto rresht
orbital-remove-row = Hiq rreshtin
orbital-add-box = Shto kuti
orbital-remove-box = Hiq kutinë
orbital-add-up-arrow = Shto shigjetë lart
orbital-add-down-arrow = Shto shigjetë poshtë
orbital-remove-arrow = Hiq shigjetën
orbital-row-label = Etiketë për rreshtin { $row }
pretzel-answer = Përgjigje

## Math input

math-input-preview-region = paraparje e shprehjes matematike
math-input-preview = Paraparje
math-input-invalid-expression = Shprehje e pavlefshme:

## Document status

viewer-initializing = Po niset…

## Errors

error-heading = Gabim
error-found-at =
    { $span ->
        [line] Gjetur në rreshtin { $startLine }.
       *[lines] Gjetur në rreshtat { $startLine }–{ $endLine }.
    }
document-contains-errors = Ky dokument përmban gabime!
diagnostic-heading-error = Gabim
diagnostic-heading-warning = Paralajmërim
diagnostic-heading-information = Informacion
diagnostic-heading-hint = Ndihmesë
accessibility-heading-level-1 = Shkelje e qasshmërisë sipas WCAG AA
accessibility-heading-level-2 = Njoftim për qasshmërinë
something-went-wrong = Diçka shkoi keq.
renderer-load-failed = një modul paraqitjeje nuk u ngarkua. Ringarkoni faqen.
core-start-failed = Shikuesi i dokumentit nuk mundi të nisej. Ringarkoni faqen.
