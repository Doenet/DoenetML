# Kikuyu viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the ĩ/ũ orthography note and for what a
# speaker should check first.


## Answer submission

answer-checking = Nĩgũkũrorwo…
answer-submitting = Nĩgũgũtũmwo…
answer-checking-status = Macookio nĩmararorwo
answer-submitting-status = Macookio nĩmaratũmwo
answer-correct = Nĩ ma
answer-incorrect = Ti ma
answer-response-saved = Macookio Nĩmaigĩtwo
answer-percent-credit = { $percent }% cia Mabatho
answer-percent-correct = { $percent }% Nĩ ma
answer-percent-short = { $percent } %
max-credit-available = Mabatho maingĩ marĩa moimanaga: { $percent }%
attempts-remaining =
    { $count ->
        [0] gũtirĩ kũgeria gũtigarĩte
        [one] nĩgũtigarĩte kũgeria { $count }
       *[other] nĩgũtigarĩte kũgeria { $count }
    }
validation-correct = (Nĩ ma)
validation-incorrect = (Ti ma)
validation-partially-correct = (Nĩ ma kũrĩ gĩcunjĩ)
answer-show-responses =
    { $count ->
        [one] Onania macookio { $count } harĩ { $answerId }
       *[other] Onania macookio { $count } harĩ { $answerId }
    }

## Disclosure panels

feedback-heading = Mataaro
collapsible-click-to-open = (ringa nĩguo ũhingũre)
collapsible-click-to-close = (ringa nĩguo ũhinge)
collapsible-initializing = Nĩgũkwambĩrĩria…
footnote-show = Onania kĩandĩko kĩa thĩ
footnote-hide = Hitha kĩandĩko kĩa thĩ
description-more-information = ũhoro ũngĩ

## Controls

slider-previous = Ĩrĩa ĩhĩtũkĩte
slider-next = Ĩrĩa ĩrũmĩrĩire
keyboard-open = Hingũra Kĩboodi
keyboard-close = Hinga Kĩboodi
choice-input-remove-choice = Eheria { $choice }
matrix-remove-row = Eheria mũhari
matrix-add-row = Ongerera mũhari
matrix-remove-column = Eheria gĩtugĩ
matrix-add-column = Ongerera gĩtugĩ
subset-add-remove-points = Ongerera/Eheria ndoti
subset-toggle-points-intervals = Garũra ndoti na ihinda
subset-move-points = Thaamia Ndoti
subset-clear = Thambia
orbital-add-row = Ongerera Mũhari
orbital-remove-row = Eheria Mũhari
orbital-add-box = Ongerera Ithandũkũ
orbital-remove-box = Eheria Ithandũkũ
orbital-add-up-arrow = Ongerera Mũguĩ wa Igũrũ
orbital-add-down-arrow = Ongerera Mũguĩ wa Thĩ
orbital-remove-arrow = Eheria Mũguĩ
orbital-row-label = Rĩĩtwa rĩa mũhari { $row }
pretzel-answer = Macookio

## Math input

math-input-preview-region = kwĩrorera kwa mũhianĩre wa mĩigana
math-input-preview = Kwĩrorera
math-input-invalid-expression = Mũhianĩre ũtarĩ mwega:

## Document status

viewer-initializing = Nĩgũkwambĩrĩria…

## Errors

error-heading = Ihĩtia
error-found-at =
    { $span ->
        [line] Nĩrĩoneka mũhari-inĩ wa { $startLine }.
       *[lines] Nĩrĩoneka mĩhari-inĩ ya { $startLine }–{ $endLine }.
    }
document-contains-errors = Ĩbuku rĩrĩ rĩrĩ na mahĩtia!
diagnostic-heading-error = Ihĩtia
diagnostic-heading-warning = Mũkaana
diagnostic-heading-information = Ũhoro
diagnostic-heading-hint = Ũtaaro
accessibility-heading-level-1 = Kũagarara WCAG AA kwa Ũkinyĩrĩri
accessibility-heading-level-2 = Mũkaana wa ũkinyĩrĩri
something-went-wrong = Nĩ harĩ ũndũ ũtathiĩte wega.
renderer-load-failed = mũonania nĩ waremirwo nĩ gũkuua. Ndagũthaitha ũcokererie karatathi.
core-start-failed = Mũonania wa ĩbuku nĩ waremirwo nĩ kwambĩrĩria. Ndagũthaitha ũcokererie karatathi.
