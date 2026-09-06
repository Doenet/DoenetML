# Bulu viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the noun-class table, the vocabulary
# strategy, and what a speaker should check first. Pairs with `locales/ewo`
# (Ewondo), Bulu's closest sister in the Beti-Pahuin group — see that
# header's note once both catalogs exist.


## Answer submission

answer-checking = A ke yene nkobo...
answer-submitting = A ke lômane nkobo...
answer-checking-status = Nkobo wu ke yenban
answer-submitting-status = Nkobo wu ke lômban
answer-correct = Mvaé
answer-incorrect = Abé
answer-response-saved = Nkobo Wu Along
answer-percent-credit = { $percent }% a Mapwan
answer-percent-correct = { $percent }% Mvaé
answer-percent-short = { $percent } %
max-credit-available = Mapwan me ne fe abui: { $percent }%
attempts-remaining =
    { $count ->
        [0] a nga bo mekeñ me ne fe te
        [one] mekeñ me ne fe { $count } m'a tôbô
       *[other] mekeñ me ne fe { $count } m'a tôbô
    }
validation-correct = (Mvaé)
validation-incorrect = (Abé)
validation-partially-correct = (Mvaé asu ntôtôlô)
answer-show-responses =
    { $count ->
        [one] Yene nkobo { $count } w'a { $answerId }
       *[other] Yene nkobo { $count } w'a { $answerId }
    }

## Disclosure panels

feedback-heading = Njô
collapsible-click-to-open = (bo klik asu na o kuli)
collapsible-click-to-close = (bo klik asu na o kale)
collapsible-initializing = A ke tebe...
footnote-show = Yene ntili w'ase
footnote-hide = Kasé ntili w'ase
description-more-information = melu me bibsimilane

## Controls

slider-previous = Avan
slider-next = Apre
keyboard-open = Kuli Klavye
keyboard-close = Kale Klavye
choice-input-remove-choice = Lôs { $choice }
matrix-remove-row = Lôs ndamba
matrix-add-row = Tôbô ndamba
matrix-remove-column = Lôs kolonu
matrix-add-column = Tôbô kolonu
subset-add-remove-points = Tôbô/Lôs bipwɛ̃
subset-toggle-points-intervals = Kelege bipwɛ̃ ai mintɛrval
subset-move-points = Yenane Bipwɛ̃
subset-clear = Wôé mese
orbital-add-row = Tôbô Ndamba
orbital-remove-row = Lôs Ndamba
orbital-add-box = Tôbô Bwat
orbital-remove-box = Lôs Bwat
orbital-add-up-arrow = Tôbô Flèsh Ya Ke Étam
orbital-add-down-arrow = Tôbô Flèsh Ya Ke Asi
orbital-remove-arrow = Lôs Flèsh
orbital-row-label = Jôé a ndamba { $row }
pretzel-answer = Nkobo

## Math input

math-input-preview-region = ntôtôlô a nônga ya mibalo
math-input-preview = Nônga
math-input-invalid-expression = Nônga é si mvaé ki:

## Document status

viewer-initializing = A ke tebe...

## Errors

error-heading = Abé
error-found-at =
    { $span ->
        [line] A yiane ke ndamba { $startLine }.
       *[lines] A yiane ke ndamba { $startLine }–{ $endLine }.
    }
document-contains-errors = Kalate nyi a ne bibé!
diagnostic-heading-error = Abé
diagnostic-heading-warning = Ayɔŋ
diagnostic-heading-information = Melu
diagnostic-heading-hint = Ajô
accessibility-heading-level-1 = Ntyeñ WCAG AA w'akusa
accessibility-heading-level-2 = Ayɔŋ w'akusa
something-went-wrong = Jôm éziñ é nga bo abé.
renderer-load-failed = ntolan é si kuli ki. Kobo pilibule ibumu.
core-start-failed = Kalanga a kalate a si tebe ki. Kobo pilibule ibumu.
