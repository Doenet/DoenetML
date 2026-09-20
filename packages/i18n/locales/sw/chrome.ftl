# Swahili viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Swahili has two plural categories, and a noun marks number with a class
# prefix rather than a suffix: «jaribio moja», «majaribio matano». So the
# selects are kept and the noun changes shape inside them, which is the same
# reason the Slavic catalogs keep theirs.


## Answer submission

answer-checking = Inaangalia...
answer-submitting = Inawasilisha...
answer-checking-status = Inaangalia jibu
answer-submitting-status = Inawasilisha jibu
answer-correct = Sahihi
answer-incorrect = Si sahihi
answer-response-saved = Jibu Limehifadhiwa
answer-percent-credit = Alama { $percent }%
answer-percent-correct = { $percent }% Sahihi
answer-percent-short = { $percent }%
max-credit-available = Alama za juu zinazopatikana: { $percent }%
attempts-remaining =
    { $count ->
        [0] hakuna majaribio yaliyosalia
        [one] jaribio { $count } limesalia
       *[other] majaribio { $count } yamesalia
    }
validation-correct = (Sahihi)
validation-incorrect = (Si sahihi)
validation-partially-correct = (Sahihi kwa sehemu)
answer-show-responses =
    { $count ->
        [one] Onyesha jibu { $count } kwa { $answerId }
       *[other] Onyesha majibu { $count } kwa { $answerId }
    }

## Disclosure panels

feedback-heading = Maoni
collapsible-click-to-open = (bofya ili kufungua)
collapsible-click-to-close = (bofya ili kufunga)
collapsible-initializing = Inaanzisha...
footnote-show = Onyesha tanbihi
footnote-hide = Ficha tanbihi
description-more-information = maelezo zaidi

## Controls

slider-previous = Nyuma
slider-next = Mbele
keyboard-open = Fungua Kibodi
keyboard-close = Funga Kibodi
choice-input-remove-choice = Ondoa { $choice }
matrix-remove-row = Ondoa safu mlalo
matrix-add-row = Ongeza safu mlalo
matrix-remove-column = Ondoa safu wima
matrix-add-column = Ongeza safu wima
subset-add-remove-points = Ongeza/Ondoa nukta
subset-toggle-points-intervals = Badilisha kati ya nukta na vipindi
subset-move-points = Sogeza Nukta
subset-clear = Futa
# A `box` here is one orbital, drawn as a square: kisanduku.
orbital-add-row = Ongeza Safu
orbital-remove-row = Ondoa Safu
orbital-add-box = Ongeza Kisanduku
orbital-remove-box = Ondoa Kisanduku
orbital-add-up-arrow = Ongeza Mshale wa Juu
orbital-add-down-arrow = Ongeza Mshale wa Chini
orbital-remove-arrow = Ondoa Mshale
orbital-row-label = Lebo ya safu { $row }
pretzel-answer = Jibu

## Math input

math-input-preview-region = hakikisho la kielezi cha hisabati
math-input-preview = Hakikisho
math-input-invalid-expression = Kielezi si sahihi:

## Document status

viewer-initializing = Inaanzisha...

## Errors

error-heading = Hitilafu
error-found-at =
    { $span ->
        [line] Imepatikana kwenye mstari { $startLine }.
       *[lines] Imepatikana kwenye mistari { $startLine }–{ $endLine }.
    }
document-contains-errors = Hati hii ina hitilafu!
diagnostic-heading-error = Hitilafu
diagnostic-heading-warning = Onyo
diagnostic-heading-information = Taarifa
diagnostic-heading-hint = Kidokezo
accessibility-heading-level-1 = Ukiukaji wa Ufikivu wa WCAG AA
accessibility-heading-level-2 = Tahadhari ya ufikivu
something-went-wrong = Kuna kitu kimeenda vibaya.
renderer-load-failed = kionyeshi kimoja kimeshindwa kupakiwa. Tafadhali pakia ukurasa upya.
core-start-failed = Kionyeshi cha hati hakikuweza kuanzishwa. Tafadhali pakia ukurasa upya.
