# Zarma viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for why this catalog is in the roster, for the
# `son` macrolanguage decision it carries, and for what a speaker should check
# first.


## Answer submission

answer-checking = Goo ma guna…
answer-submitting = Goo ma samba…
answer-checking-status = I goo ga tuuruyaŋo guna
answer-submitting-status = I goo ga tuuruyaŋo samba
answer-correct = A ga cimi
answer-incorrect = A si cimi
answer-response-saved = Tuuruyaŋo Gaay
answer-percent-credit = { $percent }% Nooru
answer-percent-correct = { $percent }% Cimi
answer-percent-short = { $percent } %
max-credit-available = Nooru beeri kaŋ ni ga du: { $percent }%
attempts-remaining =
    { $count ->
        [0] dooni kulu si cindi
        [one] dooni { $count } cindi
       *[other] dooni { $count } cindi
    }
validation-correct = (A ga cimi)
validation-incorrect = (A si cimi)
validation-partially-correct = (A ga cimi kayna)
answer-show-responses =
    { $count ->
        [one] Cabe tuuruyaŋ { $count } { $answerId } se
       *[other] Cabe tuuruyaŋ { $count } { $answerId } se
    }

## Disclosure panels

feedback-heading = Tuuruyaŋ
collapsible-click-to-open = (kar zama a ma feeri)
collapsible-click-to-close = (kar zama a ma daabu)
collapsible-initializing = Goo ma sintin…
footnote-show = Cabe ganda hantumo
footnote-hide = Tugu ganda hantumo
description-more-information = bayrandi fo

## Controls

slider-previous = Kaŋ bisa
slider-next = Kaŋ ga kaa
keyboard-open = Feeri Klaviye
keyboard-close = Daabu Klaviye
choice-input-remove-choice = Kaa { $choice }
matrix-remove-row = Kaa kar
matrix-add-row = Tonton kar
matrix-remove-column = Kaa kolon
matrix-add-column = Tonton kolon
subset-add-remove-points = Tonton/Kaa alaama-yaŋ
subset-toggle-points-intervals = Barmay alaama-yaŋ nda alwaati-yaŋ
subset-move-points = Ganandi Alaama-yaŋ
subset-clear = Tuusu
orbital-add-row = Tonton Kar
orbital-remove-row = Kaa Kar
orbital-add-box = Tonton Sanduku
orbital-remove-box = Kaa Sanduku
orbital-add-up-arrow = Tonton Beene Hangaw
orbital-add-down-arrow = Tonton Ganda Hangaw
orbital-remove-arrow = Kaa Hangaw
orbital-row-label = Kar { $row } maa
pretzel-answer = Tuuruyaŋ

## Math input

math-input-preview-region = lasaabu sanni jina guna
math-input-preview = Guna jina
math-input-invalid-expression = Sanni kaŋ si boori:

## Document status

viewer-initializing = Goo ma sintin…

## Errors

error-heading = Taali
error-found-at =
    { $span ->
        [line] I du a kar { $startLine } ga.
       *[lines] I du a kar { $startLine }–{ $endLine } ga.
    }
document-contains-errors = Tira woo gonda taali-yaŋ!
diagnostic-heading-error = Taali
diagnostic-heading-warning = Yaamar
diagnostic-heading-information = Bayrandi
diagnostic-heading-hint = Faada
accessibility-heading-level-1 = WCAG AA Duyaŋ Sanno Ŋwaarey
accessibility-heading-level-2 = Duyaŋ yaamar
something-went-wrong = Hay fo mana boori.
renderer-load-failed = cabeko fo mana kaa. Ay ga ni ŋwaaray, ye moo ga zumandi.
core-start-failed = Tira cabeko mana hin ka sintin. Ay ga ni ŋwaaray, ye moo ga zumandi.
