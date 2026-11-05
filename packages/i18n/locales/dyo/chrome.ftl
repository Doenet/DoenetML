# Jola-Fonyi viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the noun-class table (`ka-`/`si-`/`bu-`/
# `fu-`) this catalog's compound vocabulary draws on, and for what a speaker
# should check first.


## Answer submission

answer-checking = Ka juut...
answer-submitting = Ka lel...
answer-checking-status = Ka juut kalipi
answer-submitting-status = Ka lel kalipi
answer-correct = Katofo
answer-incorrect = Katofo arus
answer-response-saved = Kalipi Ma Sit
answer-percent-credit = { $percent }% Kabay
answer-percent-correct = { $percent }% Katofo
answer-percent-short = { $percent } %
max-credit-available = Kabay kaboor ka mu am: { $percent }%
attempts-remaining =
    { $count ->
        [0] katampa arus
        [one] katampa { $count } ka sipeŋ
       *[other] sitampa { $count } si sipeŋ
    }
validation-correct = (Katofo)
validation-incorrect = (Katofo arus)
validation-partially-correct = (Katofo kapat)
answer-show-responses =
    { $count ->
        [one] Won kalipi { $count } ku { $answerId }
       *[other] Won silipi { $count } si ku { $answerId }
    }

## Disclosure panels

feedback-heading = Silipi si kasandi
collapsible-click-to-open = (toot buka tulen)
collapsible-click-to-close = (toot buka kant)
collapsible-initializing = Ka tam...
footnote-show = Won kasandi ka katep
footnote-hide = Cim kasandi ka katep
description-more-information = sikeer sixaley

## Controls

slider-previous = Ka paa
slider-next = Ka taŋ
keyboard-open = Tulen Kibɔd
keyboard-close = Kant Kibɔd
choice-input-remove-choice = Cim { $choice }
matrix-remove-row = Cim karoo
matrix-add-row = Lomb karoo
matrix-remove-column = Cim kakolom
matrix-add-column = Lomb kakolom
subset-add-remove-points = Lomb/Cim situt
subset-toggle-points-intervals = Yeen situt ase siyintaval
subset-move-points = Baŋ Situt
subset-clear = Lëf
orbital-add-row = Lomb Karoo
orbital-remove-row = Cim Karoo
orbital-add-box = Lomb Kabɔks
orbital-remove-box = Cim Kabɔks
orbital-add-up-arrow = Lomb Kaaro ka Katoŋ
orbital-add-down-arrow = Lomb Kaaro ka Katep
orbital-remove-arrow = Cim Kaaro
orbital-row-label = Funoor ka karoo { $row }
pretzel-answer = Kalipi

## Math input

math-input-preview-region = won funkeer ka mat paa
math-input-preview = Won paa
math-input-invalid-expression = Funkeer ka yem arus:

## Document status

viewer-initializing = Ka tam...

## Errors

error-heading = Kakaañ
error-found-at =
    { $span ->
        [line] Ma siit ku kalay { $startLine }.
       *[lines] Ma siit ku silay { $startLine }–{ $endLine }.
    }
document-contains-errors = Kabuk kanɛ ka na sikaañ!
diagnostic-heading-error = Kakaañ
diagnostic-heading-warning = Kafur
diagnostic-heading-information = Funkeer
diagnostic-heading-hint = Kasandi
accessibility-heading-level-1 = WCAG AA Kakaañ ka Kasoot
accessibility-heading-level-2 = Kafur ka kasoot
something-went-wrong = Kajaŋ ka yem arus.
renderer-load-failed = kayiraŋ kajaŋ ka lel arus. Yeen kapej.
core-start-failed = Kayiraŋ ka kabuk ka tam arus. Yeen kapej.
