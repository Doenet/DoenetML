# Nyankole viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the noun-class table — this catalog answers
# five classes, one short of `locales/lg`'s six — and for what a speaker should
# check first.


## Answer submission

answer-checking = Nikicendererezibwa…
answer-submitting = Nikyohererezibwa…
answer-checking-status = Eky'okugarukamu nikicendererezibwa
answer-submitting-status = Eky'okugarukamu nikyohererezibwa
answer-correct = Nikyo
answer-incorrect = Tikyo
answer-response-saved = Eky'okugarukamu Kibiikirwe
answer-percent-credit = { $percent }% ez'Amanota
answer-percent-correct = { $percent }% Nikyo
answer-percent-short = { $percent } %
max-credit-available = Amanota maingi agariho: { $percent }%
attempts-remaining =
    { $count ->
        [0] tihariho kugyezaho okusigaire
        [one] hasigaire okugyezaho { $count }
       *[other] hasigaire okugyezaho { $count }
    }
validation-correct = (Nikyo)
validation-incorrect = (Tikyo)
validation-partially-correct = (Nikyo aha rubaju)
answer-show-responses =
    { $count ->
        [one] Yoreka eky'okugarukamu { $count } aha { $answerId }
       *[other] Yoreka eby'okugarukamu { $count } aha { $answerId }
    }

## Disclosure panels

feedback-heading = Ekiteekateeko
collapsible-click-to-open = (kanda okwigura)
collapsible-click-to-close = (kanda okwigara)
collapsible-initializing = Nikitandika…
footnote-show = Yoreka ekyandiikirwe aha nsi
footnote-hide = Sherekyera ekyandiikirwe aha nsi
description-more-information = amakuru maingi

## Controls

slider-previous = Ekihweireho
slider-next = Ekirikukuratsya
keyboard-open = Igura Kiiboodi
keyboard-close = Igara Kiiboodi
choice-input-remove-choice = Ihaho { $choice }
matrix-remove-row = Ihaho omurongo
matrix-add-row = Ongyeraho omurongo
matrix-remove-column = Ihaho empagi
matrix-add-column = Ongyeraho empagi
subset-add-remove-points = Ongyeraho/Ihaho obudomo
subset-toggle-points-intervals = Hindura obudomo n'ebicweka
subset-move-points = Rugurura Obudomo
subset-clear = Ihaho byona
orbital-add-row = Ongyeraho Omurongo
orbital-remove-row = Ihaho Omurongo
orbital-add-box = Ongyeraho Akasanduuko
orbital-remove-box = Ihaho Akasanduuko
orbital-add-up-arrow = Ongyeraho Akambi Karikuza Ahaiguru
orbital-add-down-arrow = Ongyeraho Akambi Karikuza Ahansi
orbital-remove-arrow = Ihaho Akambi
orbital-row-label = Eiziina ry'omurongo { $row }
pretzel-answer = Eky'okugarukamu

## Math input

math-input-preview-region = okureeba omu maisho eby'ebibaro
math-input-preview = Okureeba omu maisho
math-input-invalid-expression = Ekigambo ekitari kyo:

## Document status

viewer-initializing = Nikitandika…

## Errors

error-heading = Ekihabo
error-found-at =
    { $span ->
        [line] Kishangirwe aha murongo { $startLine }.
       *[lines] Kishangirwe aha mirongo { $startLine }–{ $endLine }.
    }
document-contains-errors = Ekitabo eki kiine ebihabo!
diagnostic-heading-error = Ekihabo
diagnostic-heading-warning = Okurabura
diagnostic-heading-information = Amakuru
diagnostic-heading-hint = Akamanyiso
accessibility-heading-level-1 = Okuhenda WCAG AA omu Kuhikaho
accessibility-heading-level-2 = Okurabura kw'okuhikaho
something-went-wrong = Hariho ekitagyenzire gye.
renderer-load-failed = omworeki tarahikire. Nooyeshengyereza garura orupapura.
core-start-failed = Omworeki w'ekitabo tarutandikire. Nooyeshengyereza garura orupapura.
