# Bemba viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the noun-class table and for what a speaker
# should check first.


## Answer submission

answer-checking = Kuleceeceta…
answer-submitting = Kuletuma…
answer-checking-status = Icasuko cileceecetwa
answer-submitting-status = Icasuko cileletumwa
answer-correct = Calungama
answer-incorrect = Tacalungeme
answer-response-saved = Icasuko Casungwa
answer-percent-credit = { $percent }% ya Mapoyinti
answer-percent-correct = { $percent }% Calungama
answer-percent-short = { $percent } %
max-credit-available = Amapoyinti ayengi ayaba: { $percent }%
attempts-remaining =
    { $count ->
        [0] takwaba ukwesha ukwashala
        [one] kwashala ukwesha { $count }
       *[other] kwashala ukwesha { $count }
    }
validation-correct = (Calungama)
validation-incorrect = (Tacalungeme)
validation-partially-correct = (Calungama pa lubali)
answer-show-responses =
    { $count ->
        [one] Langa icasuko { $count } kuli { $answerId }
       *[other] Langa amasuko { $count } kuli { $answerId }
    }

## Disclosure panels

feedback-heading = Ukwasuka
collapsible-click-to-open = (tinya ukwisula)
collapsible-click-to-close = (tinya ukwisala)
collapsible-initializing = Kuletendeka…
footnote-show = Langa icalembwa ca panshi
footnote-hide = Fisa icalembwa ca panshi
description-more-information = ilyashi limbi

## Controls

slider-previous = Icapitapo
slider-next = Icakonkapo
keyboard-open = Isula Kibodi
keyboard-close = Isala Kibodi
choice-input-remove-choice = Fumya { $choice }
matrix-remove-row = Fumya umutalale
matrix-add-row = Lundapo umutalale
matrix-remove-column = Fumya ulukolomu
matrix-add-column = Lundapo ulukolomu
subset-add-remove-points = Lundapo/Fumya amapoyinti
subset-toggle-points-intervals = Aluka amapoyinti ne nshita
subset-move-points = Kunkusha Amapoyinti
subset-clear = Fumyapo
orbital-add-row = Lundapo Umutalale
orbital-remove-row = Fumya Umutalale
orbital-add-box = Lundapo Ibokoshi
orbital-remove-box = Fumya Ibokoshi
orbital-add-up-arrow = Lundapo Umufwi wa Kuulu
orbital-add-down-arrow = Lundapo Umufwi wa Panshi
orbital-remove-arrow = Fumya Umufwi
orbital-row-label = Ishina lya mutalale { $row }
pretzel-answer = Icasuko

## Math input

math-input-preview-region = ukumona kwa numbala pa ntanshi
math-input-preview = Ukumona pa ntanshi
math-input-invalid-expression = Ukulanda ukwabipa:

## Document status

viewer-initializing = Kuletendeka…

## Errors

error-heading = Ubulubo
error-found-at =
    { $span ->
        [line] Bwasangwa pa mutalale { $startLine }.
       *[lines] Bwasangwa pa mitalale { $startLine }–{ $endLine }.
    }
document-contains-errors = Ici cipepala cakwata amalubo!
diagnostic-heading-error = Ubulubo
diagnostic-heading-warning = Ukusoka
diagnostic-heading-information = Ilyashi
diagnostic-heading-hint = Akalangililo
accessibility-heading-level-1 = Ukupula kwa WCAG AA kwa Kufikako
accessibility-heading-level-2 = Ukusoka kwa kufikako
something-went-wrong = Kwaliba icishalungeme.
renderer-load-failed = kalanga tafikile. Napapata pilibula ibula.
core-start-failed = Kalanga wa cipepala tatendeke. Napapata pilibula ibula.
