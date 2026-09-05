# Hmong Njua viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The tag is `hnj` (Hmong Njua, Green Hmong) rather than the macrolanguage
# `hmn`, and deliberately: CLDR carries plural rules for `hnj` and none for
# `hmn`, so `Intl.PluralRules("hnj")` answers with Hmong's single category
# where `hmn` falls back to English and offers a `one` the language does not
# have. `Intl.DisplayNames` is more precise too — "Hmong Njua" against plain
# "Hmong". Number formatting and list joining fall back to English under
# either tag, `Intl` having no data for the pair; that is a gap to fix in
# CLDR rather than a reason to prefer the macrolanguage.
#
# Hmong does not inflect for number — CLDR gives `hnj` the single category
# `other` — so a countable message needs no selection. `[0]` is still spelled
# out where the English wording changes for zero, because that is a different
# sentence rather than a different number.


## Answer submission

answer-checking = Tab tom kuaj...
answer-submitting = Tab tom xa...
answer-checking-status = Tab tom kuaj cov lus teb
answer-submitting-status = Tab tom xa cov lus teb
answer-correct = Yog
answer-incorrect = Tsis yog
answer-response-saved = Cov lus teb khaws cia lawm
answer-percent-credit = { $percent }% ntawm cov ntsiab
answer-percent-correct = { $percent }% yog
answer-percent-short = { $percent } %
max-credit-available = Cov ntsiab siab tshaj plaws: { $percent }%
attempts-remaining =
    { $count ->
        [0] tsis tshuav sij hawm sim
       *[other] tshuav { $count } zaug sim
    }
validation-correct = (Yog)
validation-incorrect = (Tsis yog)
validation-partially-correct = (Yog ib nrab)
answer-show-responses = Qhia { $count } cov lus teb rau { $answerId }

## Disclosure panels

feedback-heading = Lus qhia rov qab
collapsible-click-to-open = (nias los qhib)
collapsible-click-to-close = (nias los kaw)
collapsible-initializing = Tab tom pib...
footnote-show = Qhia cov lus nyob hauv qab
footnote-hide = Zais cov lus nyob hauv qab
description-more-information = ntxiv lus qhia

## Controls

slider-previous = Yav tas
slider-next = Tom ntej
keyboard-open = Qhib lub keyboard
keyboard-close = Kaw lub keyboard
choice-input-remove-choice = Tshem kem { $choice }
matrix-remove-row = Tshem kem kab
matrix-add-row = Ntxiv kem kab
matrix-remove-column = Tshem kem ncaj
matrix-add-column = Ntxiv kem ncaj
subset-add-remove-points = Ntxiv/tshem cov taw
subset-toggle-points-intervals = Hloov ntawm cov taw thiab cov ntu
subset-move-points = Txav cov taw
subset-clear = Ntxuav
# A `box` here is one orbital, drawn as a square.
orbital-add-row = Ntxiv kem kab
orbital-remove-row = Tshem kem kab
orbital-add-box = Ntxiv lub thawv
orbital-remove-box = Tshem lub thawv
orbital-add-up-arrow = Ntxiv tus xub taw rau saum
orbital-add-down-arrow = Ntxiv tus xub taw rau hauv
orbital-remove-arrow = Tshem tus xub
orbital-row-label = Lub npe rau kem kab { $row }
pretzel-answer = Lus teb

## Math input

math-input-preview-region = saib ua ntej cov lej
math-input-preview = Saib ua ntej
math-input-invalid-expression = Cov lej tsis raug:

## Document status

viewer-initializing = Tab tom pib...

## Errors

error-heading = Yuam kev
error-found-at =
    { $span ->
        [line] Pom nyob rau kab { $startLine }.
       *[lines] Pom nyob rau cov kab { $startLine }–{ $endLine }.
    }
document-contains-errors = Daim ntawv no muaj kev yuam kev!
diagnostic-heading-error = Yuam kev
diagnostic-heading-warning = Ceeb toom
diagnostic-heading-information = Lus qhia
diagnostic-heading-hint = Lus taw qhia
accessibility-heading-level-1 = Ua txhaum WCAG AA txog kev nkag tau
accessibility-heading-level-2 = Ceeb toom txog kev nkag tau
something-went-wrong = Muaj ib yam ua tsis tau zoo.
renderer-load-failed = ib feem ntawm cov duab tsis tau thauj tau. Thov rov qab thauj nplooj no dua.
core-start-failed = Tsis tau pib tau tus saib ntaub ntawv. Thov rov qab thauj nplooj no dua.
