# Ewondo viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the family, orthography and agreement notes.
# This catalog carries no `$gender`/`$role` forks — chrome has none to carry —
# so it is a simpler read than `content.ftl`; the notes there still apply to
# the words chosen here.


## Answer submission

answer-checking = A ke lɛk...
answer-submitting = A ke lɔɔt...
answer-checking-status = Ajapkɔb a ke lɛk
answer-submitting-status = Ajapkɔb a ke lɔɔt
answer-correct = Mvɛ̃
answer-incorrect = Abé
answer-response-saved = Ajapkɔb da bí
answer-percent-credit = { $percent }% ya mfaŋ
answer-percent-correct = { $percent }% mvɛ̃
answer-percent-short = { $percent } %
max-credit-available = Mfaŋ ô ne mbɛnge : { $percent }%
attempts-remaining =
    { $count ->
        [0] a bɔŋ ke lat étam éziŋ
       *[other] a bɔŋ ke lat étam { $count }
    }
validation-correct = (Mvɛ̃)
validation-incorrect = (Abé)
validation-partially-correct = (Mvɛ̃ mbílé)
answer-show-responses =
    { $count ->
        [one] Yen ajapkɔb { $count } dama { $answerId }
       *[other] Yen ajapkɔb { $count } dama { $answerId }
    }

## Disclosure panels

feedback-heading = Ayoŋ
collapsible-click-to-open = (kaba na o fúlé)
collapsible-click-to-close = (kaba na o kɔŋ)
collapsible-initializing = A ke tébege...
footnote-show = Yen ntílán
footnote-hide = Kɔŋ ntílán
description-more-information = mam mefe

## Controls

slider-previous = Osú
slider-next = Ényiñ
keyboard-open = Fúlé Kavye
keyboard-close = Kɔŋ Kavye
choice-input-remove-choice = Kɔt { $choice }
matrix-remove-row = Kɔt elɔŋ
matrix-add-row = Tob elɔŋ
matrix-remove-column = Kɔt kolɔn
matrix-add-column = Tob kolɔn
subset-add-remove-points = Tob/Kɔt bipwɛ̃
subset-toggle-points-intervals = Bulane bipwɛ̃ a bibaŋ
subset-move-points = Ke a bipwɛ̃
subset-clear = Vɔmɛ
orbital-add-row = Tob Elɔŋ
orbital-remove-row = Kɔt Elɔŋ
orbital-add-box = Tob Ekat
orbital-remove-box = Kɔt Ekat
orbital-add-up-arrow = Tob Nsom wa Zu
orbital-add-down-arrow = Tob Nsom wa Si
orbital-remove-arrow = Kɔt Nsom
orbital-row-label = Dzina ya elɔŋ { $row }
pretzel-answer = Ajapkɔb

## Math input

math-input-preview-region = mben ya ntili wa matematik
math-input-preview = Ntili
math-input-invalid-expression = Ntili a si mvɛ̃ te :

## Document status

viewer-initializing = A ke tébege...

## Errors

error-heading = Abé
error-found-at =
    { $span ->
        [line] A yén nyo si elɔŋ { $startLine }.
       *[lines] A yén nyo si melɔŋ { $startLine }–{ $endLine }.
    }
document-contains-errors = Ayôs di ne abé!
diagnostic-heading-error = Abé
diagnostic-heading-warning = Ayɛgɛlɛ
diagnostic-heading-information = Foɔn
diagnostic-heading-hint = Ntílán
accessibility-heading-level-1 = Abé ya WCAG AA
accessibility-heading-level-2 = Ayɛgɛlɛ ya ndoŋ
something-went-wrong = Jôm éziŋ a si mvɛ̃ te.
renderer-load-failed = elát éziŋ a si fúlé te. Bulane page te, o kaba.
core-start-failed = Ndoŋ ya ayôs a si tébege te. Bulane page te, o kaba.
