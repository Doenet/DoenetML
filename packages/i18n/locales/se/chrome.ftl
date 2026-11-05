# Northern Sami viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Northern Sami is the first locale here to count in a **dual**. CLDR gives it
# `one`, `two` and `other`, so a `{ $count -> … }` below that prints its number
# writes three branches, and the middle one is not a rounding of the plural:
# two of a thing is its own number in Sami, as it is in the pronouns and in the
# verb.
#
# What the noun does across the three is not what English does either. It is in
# the nominative singular after «okta», in the genitive singular after «guokte»
# and every higher numeral — so `two` and `other` share a form that neither
# shares with `one`. Where something else in the branch still differs, the two
# are written out anyway rather than collapsed, because they are two categories
# and a later correction to one of them is unlikely to be a correction to both.
# Where nothing differs — `answer-show-responses`, whose whole branch would be
# the same string three times — the select is dropped and a comment there says
# so.
#
# `one` does not catch zero, so the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Dárkkisteamen…
answer-submitting = Sáddemin…
answer-checking-status = Dárkkista vástádusa
answer-submitting-status = Sádde vástádusa
answer-correct = Riekta
answer-incorrect = Boastut
answer-response-saved = Vástádus lea vurkejuvvon
answer-percent-credit = { $percent }% čuoggás
answer-percent-correct = { $percent }% riekta
answer-percent-short = { $percent } %
max-credit-available = Eanemus čuoggát: { $percent }%
attempts-remaining =
    { $count ->
        [0] eai leat šat geahččaleamit báhcán
        [one] { $count } geahččaleapmi báhcá
        [two] { $count } geahččaleami báhcá
       *[other] { $count } geahččaleami báhcá
    }
validation-correct = (Riekta)
validation-incorrect = (Boastut)
validation-partially-correct = (Belohahkii riekta)
# No select: the noun is the object of «čájet» and takes the accusative
# singular after every numeral, so all three categories would render the same
# string. The count still arrives and is still formatted; only the branching
# is gone.
answer-show-responses = Čájet { $count } vástádusa dása: { $answerId }

## Disclosure panels

feedback-heading = Máhcahat
collapsible-click-to-open = (coahkkal rahpat)
collapsible-click-to-close = (coahkkal gokčat)
collapsible-initializing = Álggaheamen…
footnote-show = Čájet vuolitnotáhta
footnote-hide = Čiega vuolitnotáhta
description-more-information = eanet dieđut

## Controls

slider-previous = Ovddit
slider-next = Boahtte
keyboard-open = Raba boallobeavdi
keyboard-close = Gokča boallobeavdi
choice-input-remove-choice = Váldde eret { $choice }
matrix-remove-row = Váldde eret linnjá
matrix-add-row = Lasit linnjá
matrix-remove-column = Váldde eret ceahkki
matrix-add-column = Lasit ceahkki
subset-add-remove-points = Lasit/váldde eret čuoggáid
subset-toggle-points-intervals = Molsso čuoggáid ja gaskkaid gaskkas
subset-move-points = Sirdde čuoggáid
subset-clear = Sálke
orbital-add-row = Lasit linnjá
orbital-remove-row = Váldde eret linnjá
orbital-add-box = Lasit bovssa
orbital-remove-box = Váldde eret bovssa
orbital-add-up-arrow = Lasit njuolla bajás
orbital-add-down-arrow = Lasit njuolla vulos
orbital-remove-arrow = Váldde eret njuolla
orbital-row-label = Linnjá { $row } namahus
pretzel-answer = Vástádus

## Math input

math-input-preview-region = matematihkalaš cealkaga ovdačájeheapmi
math-input-preview = Ovdačájeheapmi
math-input-invalid-expression = Gustohis cealkka:

## Document status

viewer-initializing = Álggaheamen…

## Errors

error-heading = Meattáhus
error-found-at =
    { $span ->
        [line] Gávdnon linnjás { $startLine }.
       *[lines] Gávdnon linnjáin { $startLine }–{ $endLine }.
    }
document-contains-errors = Dán dokumeanttas leat meattáhusat!
diagnostic-heading-error = Meattáhus
diagnostic-heading-warning = Váruhus
diagnostic-heading-information = Diehtu
diagnostic-heading-hint = Ráva
accessibility-heading-level-1 = WCAG AA olahanvuođa rihkkun
accessibility-heading-level-2 = Olahanvuođa váruhus
something-went-wrong = Juoga manai boastut.
renderer-load-failed = čájehanmoduvla ii viežžan. Viečča siiddu ođđasit.
core-start-failed = Dokumeantačájeheaddji ii sáhttán álggahuvvot. Viečča siiddu ođđasit.
