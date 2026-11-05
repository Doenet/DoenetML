# Southern Sotho viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Sesotho has two plural categories, and a noun marks number with a class
# prefix rather than a suffix — «teko» one attempt, «diteko» several; «karabo»
# one answer, «dikarabo» several — and it keeps doing so after a numeral. So
# the selects are kept and the noun changes shape inside them, which is the
# same reason the Slavic catalogs keep theirs. `attempts-remaining` also keeps
# its `[0]` branch, an exact-value match rather than a plural category, which
# says «ha ho» instead of counting to zero.


## Answer submission

answer-checking = Ea hlahloba...
answer-submitting = Ea romela...
answer-checking-status = E hlahloba karabo
answer-submitting-status = E romela karabo
answer-correct = E nepahetse
answer-incorrect = Ha e a nepahala
answer-response-saved = Karabo e Bolokiloe
answer-percent-credit = Matshwao { $percent }%
answer-percent-correct = { $percent }% E nepahetse
answer-percent-short = { $percent } %
max-credit-available = Matshwao a maholo a fumanehang: { $percent }%
attempts-remaining =
    { $count ->
        [0] ha ho teko e setseng
        [one] teko e { $count } e setse
       *[other] diteko tse { $count } di setse
    }
validation-correct = (E nepahetse)
validation-incorrect = (Ha e a nepahala)
validation-partially-correct = (E nepahetse karolwana)
answer-show-responses =
    { $count ->
        [one] Bontsha karabo e { $count } ho { $answerId }
       *[other] Bontsha dikarabo tse { $count } ho { $answerId }
    }

## Disclosure panels

feedback-heading = Maikutlo
collapsible-click-to-open = (tobetsa ho bula)
collapsible-click-to-close = (tobetsa ho koala)
collapsible-initializing = Ea qala...
footnote-show = Bontsha tlhaloso ya tlase
footnote-hide = Pata tlhaloso ya tlase
description-more-information = tlhahisoleseding e nngwe

## Controls

slider-previous = E fetileng
slider-next = E latelang
keyboard-open = Bula Keyboard
keyboard-close = Koala Keyboard
choice-input-remove-choice = Tlosa { $choice }
matrix-remove-row = Tlosa mola o robetseng
matrix-add-row = Eketsa mola o robetseng
matrix-remove-column = Tlosa mola o emeng
matrix-add-column = Eketsa mola o emeng
subset-add-remove-points = Eketsa/Tlosa dintlha
subset-toggle-points-intervals = Fetola pakeng tsa dintlha le dikgeo
subset-move-points = Sutumetsa Dintlha
subset-clear = Hlakola
# A `box` here is one orbital, drawn as a square: «lebokose».
orbital-add-row = Eketsa Mola
orbital-remove-row = Tlosa Mola
orbital-add-box = Eketsa Lebokose
orbital-remove-box = Tlosa Lebokose
orbital-add-up-arrow = Eketsa Motsu o Lebileng Hodimo
orbital-add-down-arrow = Eketsa Motsu o Lebileng Tlase
orbital-remove-arrow = Tlosa Motsu
orbital-row-label = Lebitso la mola { $row }
pretzel-answer = Karabo

## Math input

math-input-preview-region = ponelopele ya polelo ya dipalo
math-input-preview = Ponelopele
math-input-invalid-expression = Polelo ha e a nepahala:

## Document status

viewer-initializing = Ea qala...

## Errors

error-heading = Phoso
error-found-at =
    { $span ->
        [line] E fumanwe moleng wa { $startLine }.
       *[lines] E fumanwe melaneng ya { $startLine }–{ $endLine }.
    }
document-contains-errors = Tokomane ena e na le diphoso!
diagnostic-heading-error = Phoso
diagnostic-heading-warning = Temoso
diagnostic-heading-information = Tlhahisoleseding
diagnostic-heading-hint = Keletso
accessibility-heading-level-1 = Tlolo ya WCAG AA ya Phihlelelo
accessibility-heading-level-2 = Temoso ya phihlelelo
something-went-wrong = Ho na le se sa tsamayang hantle.
renderer-load-failed = mmontshi o le mong ha oa kgona ho kenella. Ka kopo nchafatsa leqephe.
core-start-failed = Mmontshi wa tokomane ha a kgonang ho qala. Ka kopo nchafatsa leqephe.
