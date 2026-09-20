# Ga viewer chrome: buttons, panel headers, and other UI the reader interacts
# with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for why this catalog writes no class table where
# `locales/dag` writes one, and for what a speaker should check first.


## Answer submission

answer-checking = Miikwɛ…
answer-submitting = Miimaje…
answer-checking-status = Akwɛɔ hetoo lɛ
answer-submitting-status = Amajeɔ hetoo lɛ
answer-correct = Eja
answer-incorrect = Ejaaa
answer-response-saved = Ato Hetoo Lɛ
answer-percent-credit = { $percent }% pɔintsii
answer-percent-correct = { $percent }% eja
answer-percent-short = { $percent } %
max-credit-available = Pɔintsii babaoo ni yɔɔ: { $percent }%
attempts-remaining =
    { $count ->
        [0] kasemɔ ko eshwɛɛɛ
        [one] kasemɔ { $count } eshwɛ
       *[other] kasemɔi { $count } eshwɛ
    }
validation-correct = (Eja)
validation-incorrect = (Ejaaa)
validation-partially-correct = (Eja yɛ fã ko nɔ)
answer-show-responses =
    { $count ->
        [one] Tsɔɔmɔ hetoo { $count } ni kɔɔ { $answerId } he
       *[other] Tsɔɔmɔ hetooi { $count } ni kɔɔ { $answerId } he
    }

## Disclosure panels

feedback-heading = Hesaamɔ
collapsible-click-to-open = (nyɛmɔ ni ogbele)
collapsible-click-to-close = (nyɛmɔ ni oŋa)
collapsible-initializing = Miije shishi…
footnote-show = Tsɔɔmɔ shishi kadimɔ
footnote-hide = Teemɔ shishi kadimɔ
description-more-information = saji krokomɛi

## Controls

slider-previous = Nɔ ni tsɔ hiɛ
slider-next = Nɔ ni nyiɛ sɛɛ
keyboard-open = Gbele Kiibɔd
keyboard-close = Ŋa Kiibɔd
choice-input-remove-choice = Jie { $choice }
matrix-remove-row = Jie laiŋi
matrix-add-row = Fata laiŋi he
matrix-remove-column = Jie kɔlom
matrix-add-column = Fata kɔlom he
subset-add-remove-points = Fata/Jie pɔintsii
subset-toggle-points-intervals = Tsake pɔintsii kɛ fãi
subset-move-points = Hiɛɛ Pɔintsii
subset-clear = Jie fɛɛ
orbital-add-row = Fata Laiŋi He
orbital-remove-row = Jie Laiŋi
orbital-add-box = Fata Adeka He
orbital-remove-box = Jie Adeka
orbital-add-up-arrow = Fata Gãŋ ni Kwɔ He
orbital-add-down-arrow = Fata Gãŋ ni Shi He
orbital-remove-arrow = Jie Gãŋ
orbital-row-label = Laiŋi { $row } gbɛi
pretzel-answer = Hetoo

## Math input

math-input-preview-region = yibɔi wiemɔ hiɛkwɛmɔ
math-input-preview = Hiɛkwɛmɔ
math-input-invalid-expression = Wiemɔ ni ejaaa:

## Document status

viewer-initializing = Miije shishi…

## Errors

error-heading = Tɔmɔ
error-found-at =
    { $span ->
        [line] Ana yɛ laiŋi { $startLine } nɔ.
       *[lines] Ana yɛ laiŋi { $startLine }–{ $endLine } nɔ.
    }
document-contains-errors = Wolo nɛɛ yɔɔ tɔmɔi!
diagnostic-heading-error = Tɔmɔ
diagnostic-heading-warning = Kɔkɔbɔɔ
diagnostic-heading-information = Sane
diagnostic-heading-hint = Hiɛtsɔɔmɔ
accessibility-heading-level-1 = WCAG AA shɛmɔ he tɔmɔ
accessibility-heading-level-2 = Shɛmɔ he kɔkɔbɔɔ
something-went-wrong = Nɔ ko efeee jogbaŋŋ.
renderer-load-failed = tsɔɔlɔ lɛ shɛɛɛ. Ofainɛ, tsɔɔ baafa lɛ ekoŋŋ.
core-start-failed = Wolo lɛ tsɔɔlɔ ejeee shishi. Ofainɛ, tsɔɔ baafa lɛ ekoŋŋ.
