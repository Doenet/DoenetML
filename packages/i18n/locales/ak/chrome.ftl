# Akan viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Asante Twi, as `content.ftl`'s header sets out.
#
# Akan has two plural categories, and CLDR puts **zero** in the `one` branch
# with it — so nothing here can lean on the category to say "no ...". A noun
# marks its plural with a prefix rather than a suffix: «kratafa» a page,
# «nkratafa» pages. But the two nouns these messages count — «mmɔdenbɔ» an
# attempt, «mmuaeɛ» an answer — carry that prefix in the singular already and
# have one shape for both numbers, so the selects are dropped and a `[one]`
# differing from its `[other]` would be wrong rather than merely redundant.
# `attempts-remaining` keeps its `[0]` branch, which is an exact-value match
# ahead of the category and says «biara nka ho» instead of counting to zero.


## Answer submission

answer-checking = Ɛrehwɛ...
answer-submitting = Ɛrema akɔ...
answer-checking-status = Ɛrehwɛ mmuaeɛ no
answer-submitting-status = Ɛrema mmuaeɛ no akɔ
answer-correct = Ɛteɛ
answer-incorrect = Ɛnteɛ
answer-response-saved = Wɔakora Mmuaeɛ No So
answer-percent-credit = { $percent }% Nsɛkyerɛ
answer-percent-correct = { $percent }% Ɛteɛ
answer-percent-short = { $percent } %
max-credit-available = Nsɛkyerɛ kɛseɛ a wobɛnya: { $percent }%
attempts-remaining =
    { $count ->
        [0] mmɔdenbɔ biara nka ho
       *[other] mmɔdenbɔ { $count } na aka
    }
validation-correct = (Ɛteɛ)
validation-incorrect = (Ɛnteɛ)
validation-partially-correct = (Ɛfã teɛ)
answer-show-responses = Kyerɛ mmuaeɛ { $count } a wɔde maa { $answerId }

## Disclosure panels

feedback-heading = Nsɛm a Ɛfiri Mu
collapsible-click-to-open = (mia na bue)
collapsible-click-to-close = (mia na to mu)
collapsible-initializing = Ɛrefiri aseɛ...
footnote-show = Kyerɛ ase nkaeɛ
footnote-hide = Fa ase nkaeɛ sie
description-more-information = nsɛm foforɔ

## Controls

slider-previous = Akyire
slider-next = Anim
keyboard-open = Bue Kiibɔɔd
keyboard-close = To Kiibɔɔd Mu
choice-input-remove-choice = Yi { $choice } firi mu
matrix-remove-row = Yi santene firi mu
matrix-add-row = Fa santene ka ho
matrix-remove-column = Yi adum firi mu
matrix-add-column = Fa adum ka ho
subset-add-remove-points = Fa pɔint ka ho/Yi firi mu
subset-toggle-points-intervals = Sesa pɔint ne ntam
subset-move-points = Twe Pɔint No
subset-clear = Popa
# A `box` here is one orbital, drawn as a square: «adaka».
orbital-add-row = Fa Santene Ka Ho
orbital-remove-row = Yi Santene Firi Mu
orbital-add-box = Fa Adaka Ka Ho
orbital-remove-box = Yi Adaka Firi Mu
orbital-add-up-arrow = Fa Bɛmma A Ɛkyerɛ Soro Ka Ho
orbital-add-down-arrow = Fa Bɛmma A Ɛkyerɛ Fam Ka Ho
orbital-remove-arrow = Yi Bɛmma Firi Mu
orbital-row-label = Santene { $row } din
pretzel-answer = Mmuaeɛ

## Math input

math-input-preview-region = akontabuo nkyerɛwee ho nhwɛ
math-input-preview = Nhwɛ
math-input-invalid-expression = Nkyerɛwee no nteɛ:

## Document status

viewer-initializing = Ɛrefiri aseɛ...

## Errors

error-heading = Mfomsoɔ
error-found-at =
    { $span ->
        [line] Wohunuu no wɔ layin { $startLine } so.
       *[lines] Wohunuu no wɔ layin { $startLine }–{ $endLine } so.
    }
document-contains-errors = Mfomsoɔ wɔ krataa yi mu!
diagnostic-heading-error = Mfomsoɔ
diagnostic-heading-warning = Kɔkɔbɔ
diagnostic-heading-information = Nsɛm
diagnostic-heading-hint = Akwankyerɛ
accessibility-heading-level-1 = WCAG AA Nhyehyɛeɛ A Wɔabu So
accessibility-heading-level-2 = Nkɔmu-kwan ho kɔkɔbɔ
something-went-wrong = Biribi ansi yie.
renderer-load-failed = ɔkyerɛfoɔ baako antumi amma. Yɛsrɛ wo, san fa kratafa no bra.
core-start-failed = Krataa kyerɛfoɔ no antumi anfiri aseɛ. Yɛsrɛ wo, san fa kratafa no bra.
