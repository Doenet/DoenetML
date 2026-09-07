# Icelandic viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Icelandic counts in the same two plural categories English does, so every
# `{ $count -> … }` below keeps the shape it had — but the category is decided
# by the *last digit*, so 21 and 101 take the singular the way 1 does, while 11
# and 111 do not. That is CLDR's rule and Fluent applies it; the branches only
# have to be written.


## Answer submission

answer-checking = Athuga…
answer-submitting = Sendi…
answer-checking-status = Athuga svar
answer-submitting-status = Sendi svar
answer-correct = Rétt
answer-incorrect = Rangt
answer-response-saved = Svar vistað
answer-percent-credit = { $percent }% einkunn
answer-percent-correct = { $percent }% rétt
answer-percent-short = { $percent } %
max-credit-available = Hámarkseinkunn í boði: { $percent }%
attempts-remaining =
    { $count ->
        [0] engar tilraunir eftir
        [one] { $count } tilraun eftir
       *[other] { $count } tilraunir eftir
    }
validation-correct = (Rétt)
validation-incorrect = (Rangt)
validation-partially-correct = (Að hluta rétt)
answer-show-responses =
    { $count ->
        [one] Sýna { $count } svar við { $answerId }
       *[other] Sýna { $count } svör við { $answerId }
    }

## Disclosure panels

feedback-heading = Endurgjöf
collapsible-click-to-open = (smelltu til að opna)
collapsible-click-to-close = (smelltu til að loka)
collapsible-initializing = Ræsi…
footnote-show = Sýna neðanmálsgrein
footnote-hide = Fela neðanmálsgrein
description-more-information = nánari upplýsingar

## Controls

slider-previous = Fyrri
slider-next = Næsta
keyboard-open = Opna lyklaborð
keyboard-close = Loka lyklaborði
choice-input-remove-choice = Fjarlægja { $choice }
matrix-remove-row = Fjarlægja röð
matrix-add-row = Bæta við röð
matrix-remove-column = Fjarlægja dálk
matrix-add-column = Bæta við dálki
subset-add-remove-points = Bæta við/fjarlægja punkta
subset-toggle-points-intervals = Skipta milli punkta og bila
subset-move-points = Færa punkta
subset-clear = Hreinsa
orbital-add-row = Bæta við röð
orbital-remove-row = Fjarlægja röð
orbital-add-box = Bæta við reit
orbital-remove-box = Fjarlægja reit
orbital-add-up-arrow = Bæta við ör upp
orbital-add-down-arrow = Bæta við ör niður
orbital-remove-arrow = Fjarlægja ör
orbital-row-label = Merki fyrir röð { $row }
pretzel-answer = Svar

## Math input

math-input-preview-region = forskoðun stærðfræðisegðar
math-input-preview = Forskoðun
math-input-invalid-expression = Ógild segð:

## Document status

viewer-initializing = Ræsi…

## Errors

error-heading = Villa
error-found-at =
    { $span ->
        [line] Fannst í línu { $startLine }.
       *[lines] Fannst í línum { $startLine }–{ $endLine }.
    }
document-contains-errors = Þetta skjal inniheldur villur!
diagnostic-heading-error = Villa
diagnostic-heading-warning = Aðvörun
diagnostic-heading-information = Upplýsingar
diagnostic-heading-hint = Ábending
accessibility-heading-level-1 = Brot á WCAG AA aðgengiskröfum
accessibility-heading-level-2 = Aðgengisviðvörun
something-went-wrong = Eitthvað fór úrskeiðis.
renderer-load-failed = teiknari hlóðst ekki. Endurhlaððu síðuna.
core-start-failed = Ekki tókst að ræsa skjalaskoðarann. Endurhlaððu síðuna.
