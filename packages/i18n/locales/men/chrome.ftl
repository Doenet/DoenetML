# Mende viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for why the describing words here are left
# indefinite, and for what a speaker should check first.


## Answer submission

answer-checking = A gbɔɔ…
answer-submitting = A ve…
answer-checking-status = Ta njepei gbɔɔ
answer-submitting-status = Ta njepei ve
answer-correct = A tonya
answer-incorrect = Ii tonya
answer-response-saved = Njepei Yɛlɛnga
answer-percent-credit = { $percent }% Ndoli
answer-percent-correct = { $percent }% Tonya
answer-percent-short = { $percent } %
max-credit-available = Ndoli wa bi majɔɔ: { $percent }%
attempts-remaining =
    { $count ->
        [0] gɔɔla gbi ii lɔ
        [one] gɔɔla { $count } lɔ
       *[other] gɔɔla { $count } ti lɔ
    }
validation-correct = (A tonya)
validation-incorrect = (Ii tonya)
validation-partially-correct = (A tonya gbua)
answer-show-responses =
    { $count ->
        [one] Gɛnɛ njepei { $count } { $answerId } va
       *[other] Gɛnɛ njepeisia { $count } { $answerId } va
    }

## Disclosure panels

feedback-heading = Njepe woma
collapsible-click-to-open = (tɔkpɔ kɔ i gbɔyɔ)
collapsible-click-to-close = (tɔkpɔ kɔ i gbɔkɔ)
collapsible-initializing = A yɛpɛ…
footnote-show = Gɛnɛ nyɛingɔ na lɔ kunafɔ
footnote-hide = Lombi nyɛingɔ na lɔ kunafɔ
description-more-information = hinda gbe hugɔɔla

## Controls

slider-previous = Na wa ma
slider-next = Na wa woma
keyboard-open = Gbɔyɔ Kibɔd
keyboard-close = Gbɔkɔ Kibɔd
choice-input-remove-choice = Wumbu { $choice }
matrix-remove-row = Wumbu lɔlɔi
matrix-add-row = Gbua lɔlɔi
matrix-remove-column = Wumbu kɔlum
matrix-add-column = Gbua kɔlum
subset-add-remove-points = Gbua/Wumbu tɔkpɔisia
subset-toggle-points-intervals = Wote tɔkpɔisia kɛ wati sia
subset-move-points = Hiti Tɔkpɔisia
subset-clear = Wumbu kpɛlɛ
orbital-add-row = Gbua Lɔlɔi
orbital-remove-row = Wumbu Lɔlɔi
orbital-add-box = Gbua Bɔks
orbital-remove-box = Wumbu Bɔks
orbital-add-up-arrow = Gbua Aro Na Lɔ Woma
orbital-add-down-arrow = Gbua Aro Na Lɔ Kunafɔ
orbital-remove-arrow = Wumbu Aro
orbital-row-label = Lɔlɔi { $row } biyei
pretzel-answer = Njepei

## Math input

math-input-preview-region = mat njepei gɛnɛ ma
math-input-preview = Gɛnɛ ma
math-input-invalid-expression = Njepe na ii tonya:

## Document status

viewer-initializing = A yɛpɛ…

## Errors

error-heading = Hinda nyamu
error-found-at =
    { $span ->
        [line] Ti majɔɔ laing { $startLine } ma.
       *[lines] Ti majɔɔ laingsia { $startLine }–{ $endLine } ma.
    }
document-contains-errors = Buk ji hinda nyamusia lɔ hu!
diagnostic-heading-error = Hinda nyamu
diagnostic-heading-warning = Ngiti wa
diagnostic-heading-information = Hugɔɔla
diagnostic-heading-hint = Ngiti
accessibility-heading-level-1 = WCAG AA Majɔɔla Sawa Wɔlɔla
accessibility-heading-level-2 = Majɔɔla ngiti wa
something-went-wrong = Hinda yila ii yɛlɛ kɛnɛi.
renderer-load-failed = gɛnɛmɔi yila ii wanga. Kɔ bi pej ji wote.
core-start-failed = Buk gɛnɛmɔi ii gula i yɛpɛ. Kɔ bi pej ji wote.
