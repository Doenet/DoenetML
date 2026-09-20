# Malagasy viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Malagasy has two plural categories in CLDR, and its `one` catches **zero as
# well as one** (n = 0..1). A Malagasy noun is not marked for number at all —
# «{ $count } fanandramana» is both "1 attempt" and "5 attempts" — so the
# counted messages here write one branch and let it catch everything, and a
# message that says something different for zero says it with an explicit `[0]`
# rather than leaning on the category.


## Answer submission

answer-checking = Manamarina...
answer-submitting = Mandefa...
answer-checking-status = Manamarina ny valiny
answer-submitting-status = Mandefa ny valiny
answer-correct = Marina
answer-incorrect = Diso
answer-response-saved = Voatahiry ny valiny
answer-percent-credit = Naoty { $percent }%
answer-percent-correct = Marina { $percent }%
answer-percent-short = { $percent }%
max-credit-available = Naoty ambony indrindra azo: { $percent }%
attempts-remaining =
    { $count ->
        [0] tsy misy fanandramana sisa
       *[other] sisa { $count } fanandramana
    }
validation-correct = (Marina)
validation-incorrect = (Diso)
validation-partially-correct = (Marina amin'ny ampahany)
answer-show-responses = Asehoy ny valiny { $count } ho an'ny { $answerId }

## Disclosure panels

feedback-heading = Fanehoan-kevitra
collapsible-click-to-open = (tsindrio hanokatra)
collapsible-click-to-close = (tsindrio hanidy)
collapsible-initializing = Manomboka...
footnote-show = Asehoy ny fanamarihana ambany pejy
footnote-hide = Afeno ny fanamarihana ambany pejy
description-more-information = fanazavana fanampiny

## Controls

slider-previous = Teo aloha
slider-next = Manaraka
keyboard-open = Sokafy ny fitendry
keyboard-close = Akatony ny fitendry
choice-input-remove-choice = Esory ny { $choice }
matrix-remove-row = Esory ny andalana
matrix-add-row = Ampio andalana
matrix-remove-column = Esory ny tsanganana
matrix-add-column = Ampio tsanganana
subset-add-remove-points = Ampio/Esory teboka
subset-toggle-points-intervals = Ovay ny teboka sy ny elanelana
subset-move-points = Afindrao ny teboka
subset-clear = Fafao
orbital-add-row = Ampio andalana
orbital-remove-row = Esory ny andalana
orbital-add-box = Ampio boaty
orbital-remove-box = Esory ny boaty
orbital-add-up-arrow = Ampio zana-tsipika miakatra
orbital-add-down-arrow = Ampio zana-tsipika midina
orbital-remove-arrow = Esory ny zana-tsipika
orbital-row-label = Marika ho an'ny andalana { $row }
pretzel-answer = Valiny

## Math input

math-input-preview-region = topi-maso amin'ny fomba fanehoana matematika
math-input-preview = Topi-maso
math-input-invalid-expression = Fomba fanehoana tsy mety:

## Document status

viewer-initializing = Manomboka...

## Errors

error-heading = Hadisoana
error-found-at =
    { $span ->
        [line] Hita eo amin'ny andalana { $startLine }.
       *[lines] Hita eo amin'ny andalana { $startLine }–{ $endLine }.
    }
document-contains-errors = Misy hadisoana ity antontan-taratasy ity!
diagnostic-heading-error = Hadisoana
diagnostic-heading-warning = Fampitandremana
diagnostic-heading-information = Fanazavana
diagnostic-heading-hint = Toro-hevitra
accessibility-heading-level-1 = Fandikana ny fahafahana miditra WCAG AA
accessibility-heading-level-2 = Fampitandremana momba ny fahafahana miditra
something-went-wrong = Nisy tsy nety.
renderer-load-failed = nisy mpanolotra tsy tafiditra. Avereno alefa ny pejy.
core-start-failed = Tsy afaka nanomboka ny mpijery antontan-taratasy. Avereno alefa ny pejy.
