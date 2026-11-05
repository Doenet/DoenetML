# Yoruba viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Yoruba has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero, because that is a different sentence
# rather than a different number.
#
# A noun is not marked for number: «ìgbìyànjú { $count }» is both "1 attempt"
# and "5 attempts". The plural marker «àwọn» is for a noun standing without a
# numeral, so it is wrong here.


## Answer submission

answer-checking = Ń ṣàyẹ̀wò...
answer-submitting = Ń fi ránṣẹ́...
answer-checking-status = Ń ṣàyẹ̀wò ìdáhùn
answer-submitting-status = Ń fi ìdáhùn ránṣẹ́
answer-correct = Ó tọ́
answer-incorrect = Kò tọ́
answer-response-saved = A Ti Fi Ìdáhùn Pamọ́
answer-percent-credit = Àmì { $percent }%
answer-percent-correct = { $percent }% Tọ́
answer-percent-short = { $percent }%
max-credit-available = Àmì gíga jùlọ tí ó wà: { $percent }%
attempts-remaining =
    { $count ->
        [0] kò sí ìgbìyànjú tí ó kù
       *[other] ìgbìyànjú { $count } ló kù
    }
validation-correct = (Ó tọ́)
validation-incorrect = (Kò tọ́)
validation-partially-correct = (Ó tọ́ ní apá kan)
answer-show-responses = Fi ìdáhùn { $count } sí { $answerId } hàn

## Disclosure panels

feedback-heading = Èsì
collapsible-click-to-open = (tẹ̀ láti ṣí)
collapsible-click-to-close = (tẹ̀ láti tì)
collapsible-initializing = Ń bẹ̀rẹ̀...
footnote-show = Fi àkíyèsí ìsàlẹ̀ hàn
footnote-hide = Fi àkíyèsí ìsàlẹ̀ pamọ́
description-more-information = ìsọfúnni sí i

## Controls

slider-previous = Ẹ̀yìn
slider-next = Iwájú
keyboard-open = Ṣí Bọ́tìnì Ìkọ̀wé
keyboard-close = Ti Bọ́tìnì Ìkọ̀wé
choice-input-remove-choice = Yọ { $choice } kúrò
matrix-remove-row = Yọ ilà kúrò
matrix-add-row = Fi ilà kún
matrix-remove-column = Yọ ọ̀wọ̀n kúrò
matrix-add-column = Fi ọ̀wọ̀n kún
subset-add-remove-points = Fi ààmì kún / Yọ ààmì kúrò
subset-toggle-points-intervals = Yípadà láàárín ààmì àti àlàfo
subset-move-points = Gbé Àwọn Ààmì
subset-clear = Nù
# A `box` here is one orbital, drawn as a square: àpótí.
orbital-add-row = Fi Ilà Kún
orbital-remove-row = Yọ Ilà Kúrò
orbital-add-box = Fi Àpótí Kún
orbital-remove-box = Yọ Àpótí Kúrò
orbital-add-up-arrow = Fi Ọfà Òkè Kún
orbital-add-down-arrow = Fi Ọfà Ìsàlẹ̀ Kún
orbital-remove-arrow = Yọ Ọfà Kúrò
orbital-row-label = Àmì ìdámọ̀ fún ilà { $row }
pretzel-answer = Ìdáhùn

## Math input

math-input-preview-region = àwòtẹ́lẹ̀ ọ̀rọ̀ ìṣirò
math-input-preview = Àwòtẹ́lẹ̀
math-input-invalid-expression = Ọ̀rọ̀ tí kò tọ́:

## Document status

viewer-initializing = Ń bẹ̀rẹ̀...

## Errors

error-heading = Àṣìṣe
error-found-at =
    { $span ->
        [line] A rí i ní ilà { $startLine }.
       *[lines] A rí i ní àwọn ilà { $startLine }–{ $endLine }.
    }
document-contains-errors = Àkọsílẹ̀ yìí ní àwọn àṣìṣe nínú!
diagnostic-heading-error = Àṣìṣe
diagnostic-heading-warning = Ìkìlọ̀
diagnostic-heading-information = Ìsọfúnni
diagnostic-heading-hint = Ìtọ́ka
accessibility-heading-level-1 = Ìrúfin Ìwọlé WCAG AA
accessibility-heading-level-2 = Ìkìlọ̀ ìwọlé
something-went-wrong = Nǹkan kan kò lọ dáadáa.
renderer-load-failed = ohun ìṣàfihàn kan kò ṣàṣeyọrí láti gbé. Jọ̀wọ́ tún ojú-ìwé náà gbé.
core-start-failed = Ohun ìṣàfihàn àkọsílẹ̀ kò lè bẹ̀rẹ̀. Jọ̀wọ́ tún ojú-ìwé náà gbé.
