# Fon viewer chrome: buttons, panel headers, and other UI the reader interacts
# with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the split between Fon's three reduplicated
# colour statives and its nine French loans, and for what a speaker should
# check first.


## Answer submission

answer-checking = Ðò kpɔ́n wɛ…
answer-submitting = Ðò sɛ́dó wɛ…
answer-checking-status = È ɖò xósin ɔ́ kpɔ́n wɛ
answer-submitting-status = È ɖò xósin ɔ́ sɛ́dó wɛ
answer-correct = É sɔgbe
answer-incorrect = É má sɔgbe ǎ
answer-response-saved = È Bɛ́ Xósin Ɔ́ Dó
answer-percent-credit = { $percent }% Kɛ́ndɛ́
answer-percent-correct = { $percent }% Sɔgbe
answer-percent-short = { $percent } %
max-credit-available = Kɛ́ndɛ́ ɖaxó e è sixú mɔ é: { $percent }%
attempts-remaining =
    { $count ->
        [0] tɛnkpɔ́n ɖé kpò ǎ
        [one] tɛnkpɔ́n { $count } kpò
       *[other] tɛnkpɔ́n { $count } kpò
    }
validation-correct = (É sɔgbe)
validation-incorrect = (É má sɔgbe ǎ)
validation-partially-correct = (É sɔgbe ɖé)
answer-show-responses =
    { $count ->
        [one] Ðè xósin { $count } tɔ̀n { $answerId } tɔ̀n xlɛ́
       *[other] Ðè xósin { $count } tɔ̀n { $answerId } tɔ̀n xlɛ́
    }

## Disclosure panels

feedback-heading = Xósin
collapsible-click-to-open = (zin bo hun)
collapsible-click-to-close = (zin bo sú)
collapsible-initializing = Ðò bɛ́ wɛ…
footnote-show = Ðè wema dò tɔ̀n xlɛ́
footnote-hide = Hwlá wema dò tɔ̀n
description-more-information = nǔmɔnú ɖěvo lɛ́

## Controls

slider-previous = Yɛ̌yǐ
slider-next = Bɔ̌dó
keyboard-open = Hun Klavier
keyboard-close = Sú Klavier
choice-input-remove-choice = Ðè { $choice } sín mɛ
matrix-remove-row = Ðè línu sín mɛ
matrix-add-row = Sɔ́ línu dó
matrix-remove-column = Ðè kɔ́ sín mɛ
matrix-add-column = Sɔ́ kɔ́ dó
subset-add-remove-points = Sɔ́ tɛ́n dó/Ðè tɛ́n sín mɛ
subset-toggle-points-intervals = Ðyɔ́ tɛ́n kpó intervalle kpó
subset-move-points = Sɛ Tɛ́n Lɛ́ Dó
subset-clear = Súnsún
orbital-add-row = Sɔ́ Línu Dó
orbital-remove-row = Ðè Línu Sín Mɛ
orbital-add-box = Sɔ́ Gbà Dó
orbital-remove-box = Ðè Gbà Sín Mɛ
orbital-add-up-arrow = Sɔ́ Gǎ Yiaji Tɔ̀n Dó
orbital-add-down-arrow = Sɔ́ Gǎ Yidó Tɔ̀n Dó
orbital-remove-arrow = Ðè Gǎ Sín Mɛ
orbital-row-label = Nyikɔ́ línu { $row } tɔ̀n
pretzel-answer = Xósin

## Math input

math-input-preview-region = nùnywɛ́xó kpɔ́n jɛ nukɔ́n
math-input-preview = Kpɔ́n jɛ nukɔ́n
math-input-invalid-expression = Nǔnywɛ́xó e má sɔgbe ǎ é:

## Document status

viewer-initializing = Ðò bɛ́ wɛ…

## Errors

error-heading = Nùwaɖókpɔ́
error-found-at =
    { $span ->
        [line] È mɔ ɖò línu { $startLine } jí.
       *[lines] È mɔ ɖò línu { $startLine }–{ $endLine } jí.
    }
document-contains-errors = Wema élɔ́ ɖó nùwaɖókpɔ́ lɛ́!
diagnostic-heading-error = Nùwaɖókpɔ́
diagnostic-heading-warning = Gbeɖiɖe
diagnostic-heading-information = Nǔmɔnú
diagnostic-heading-hint = Alɔdo
accessibility-heading-level-1 = Gbigbà WCAG AA tɔ̀n ɖò Sisɛkpɔ́ mɛ
accessibility-heading-level-2 = Gbeɖiɖe sisɛkpɔ́ tɔ̀n
something-went-wrong = Nǔɖé má sɔgbe ǎ.
renderer-load-failed = ɖiɖexlɛ́tɔ́ ɔ́ má wá ǎ. Kú dó nú mì, lɛ́ hun wexwɛ ɔ́.
core-start-failed = Wemakpɔ́ntɔ́ ɔ́ má sixú bɛ́ ǎ. Kú dó nú mì, lɛ́ hun wexwɛ ɔ́.
