# Lingala viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lingala has two plural categories, and CLDR puts **zero** in the `one` branch
# with it, so nothing here can lean on the category to say "no ...". A noun
# marks number by changing its class prefix rather than by taking a suffix —
# «momekano» one attempt, «mimekano» several; «eyano» one answer, «biyano»
# several — and it keeps doing so after a numeral. So the selects are kept and
# the noun changes shape inside them, which is the same reason the Slavic
# catalogs keep theirs. `attempts-remaining` still writes its own `[0]` branch,
# an exact-value match ahead of the category.


## Answer submission

answer-checking = Ezali kotala...
answer-submitting = Ezali kotinda...
answer-checking-status = Ezali kotala eyano
answer-submitting-status = Ezali kotinda eyano
answer-correct = Ebongi
answer-incorrect = Ebongi te
answer-response-saved = Eyano Ebombami
answer-percent-credit = Motuya { $percent }%
answer-percent-correct = { $percent }% Ebongi
answer-percent-short = { $percent } %
max-credit-available = Motuya monene oyo ekoki kozwama: { $percent }%
attempts-remaining =
    { $count ->
        [0] momekano moko etikali te
        [one] momekano { $count } etikali
       *[other] mimekano { $count } etikali
    }
validation-correct = (Ebongi)
validation-incorrect = (Ebongi te)
validation-partially-correct = (Ebongi na ndambo)
answer-show-responses =
    { $count ->
        [one] Lakisá eyano { $count } ya { $answerId }
       *[other] Lakisá biyano { $count } ya { $answerId }
    }

## Disclosure panels

feedback-heading = Eyano ya Molakisi
collapsible-click-to-open = (finá mpo na kofungola)
collapsible-click-to-close = (finá mpo na kokanga)
collapsible-initializing = Ezali kobanda...
footnote-show = Lakisá liyebisi ya nse
footnote-hide = Bombá liyebisi ya nse
description-more-information = basango mosusu

## Controls

slider-previous = Eleki
slider-next = Elandi
keyboard-open = Fungolá Klavye
keyboard-close = Kangá Klavye
choice-input-remove-choice = Longolá { $choice }
matrix-remove-row = Longolá molɔngɔ ya kolala
matrix-add-row = Bakisá molɔngɔ ya kolala
matrix-remove-column = Longolá molɔngɔ ya kotɛlɛma
matrix-add-column = Bakisá molɔngɔ ya kotɛlɛma
subset-add-remove-points = Bakisá/Longolá matono
subset-toggle-points-intervals = Bongolá kati ya matono na bantaka
subset-move-points = Longolá Matono
subset-clear = Pɛtolá
# A `box` here is one orbital, drawn as a square: «sanduku».
orbital-add-row = Bakisá Molɔngɔ
orbital-remove-row = Longolá Molɔngɔ
orbital-add-box = Bakisá Sanduku
orbital-remove-box = Longolá Sanduku
orbital-add-up-arrow = Bakisá Likula ya Likolo
orbital-add-down-arrow = Bakisá Likula ya Nse
orbital-remove-arrow = Longolá Likula
orbital-row-label = Nkombo ya molɔngɔ { $row }
pretzel-answer = Eyano

## Math input

math-input-preview-region = botali liboso ya maloba ya matematiki
math-input-preview = Botali liboso
math-input-invalid-expression = Maloba ebongi te:

## Document status

viewer-initializing = Ezali kobanda...

## Errors

error-heading = Libunga
error-found-at =
    { $span ->
        [line] Emonani na molɔngɔ { $startLine }.
       *[lines] Emonani na milɔngɔ { $startLine }–{ $endLine }.
    }
document-contains-errors = Mokanda oyo ezali na mabunga!
diagnostic-heading-error = Libunga
diagnostic-heading-warning = Likebisi
diagnostic-heading-information = Sango
diagnostic-heading-hint = Toli
accessibility-heading-level-1 = Kobuka Mibeko ya WCAG AA mpo na Bokɔti
accessibility-heading-level-2 = Likebisi mpo na bokɔti
something-went-wrong = Eloko moko esalemi malamu te.
renderer-load-failed = molakisi moko ekokaki kokɔta te. Zongisá lokasa.
core-start-failed = Molakisi ya mokanda akokaki kobanda te. Zongisá lokasa.
