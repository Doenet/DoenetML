# Tahitian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the orthography of the Académie tahitienne (Fare Vānaʻa), which
# writes both marks that distinguish words: the glottal stop as the *ʻeta* «ʻ» —
# U+02BB, a letter and not an apostrophe — and vowel length as the *tārava*, the
# macron. That is the same trap `locales/to` records: the two render alike and
# compare unequal, so replacing a ʻeta with U+0027 changes the spelling of the
# word. The older missionary orthography writes neither mark; this catalog is
# not in it.
#
# Tahitian marks no number on the noun — plurality is «te mau» before it — so a
# `{ $count -> … }` whose two English branches differ only in the noun renders
# one string here and the select is dropped. A `[0]` branch stays wherever
# English has one.


## Answer submission

answer-checking = Te hiʻopoʻa nei…
answer-submitting = Te hōpoi nei…
answer-checking-status = Te hiʻopoʻa nei i te pāhonoraʻa
answer-submitting-status = Te hōpoi nei i te pāhonoraʻa
answer-correct = Tano
answer-incorrect = Tano ʻore
answer-response-saved = Ua tāpeʻahia te pāhonoraʻa
answer-percent-credit = { $percent }% o te tāpuraʻa
answer-percent-correct = { $percent }% tano
answer-percent-short = { $percent } %
max-credit-available = Tāpuraʻa rahi roa e nehenehe e noaʻa: { $percent }%
# No select: «tāmataraʻa» is the same word for one and for many. The `[0]`
# branch stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] ʻaita ʻe tāmataraʻa i toe
       *[other] e { $count } tāmataraʻa i toe
    }
validation-correct = (Tano)
validation-incorrect = (Tano ʻore)
validation-partially-correct = (Tano i te tahi tuhaʻa)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Faʻaʻite i te { $count } pāhonoraʻa nō te { $answerId }

## Disclosure panels

feedback-heading = Manaʻo faʻahou
collapsible-click-to-open = (pāto no te ʻiriti)
collapsible-click-to-close = (pāto no te ʻōpani)
collapsible-initializing = Te haʻamata nei…
footnote-show = Faʻaʻite i te footnote
footnote-hide = Hunā i te footnote
description-more-information = haʻamāramaramaraʻa hau

## Controls

slider-previous = I mua
slider-next = I muri
keyboard-open = ʻIriti i te papa taio
keyboard-close = ʻŌpani i te papa taio
choice-input-remove-choice = Iriti ê i te { $choice }
matrix-remove-row = Iriti ê i te ʻāfata roa
matrix-add-row = Tuʻu i te tahi ʻāfata roa
matrix-remove-column = Iriti ê i te tīʻā
matrix-add-column = Tuʻu i te tahi tīʻā
subset-add-remove-points = Tuʻu/Iriti ê i te mau poini
subset-toggle-points-intervals = Taui i te mau poini ʻe te mau ārearea
subset-move-points = Faʻanehenehe i te mau poini
subset-clear = Tāmā
orbital-add-row = Tuʻu i te tahi ʻāfata roa
orbital-remove-row = Iriti ê i te ʻāfata roa
orbital-add-box = Tuʻu i te tahi ʻāfata
orbital-remove-box = Iriti ê i te ʻāfata
orbital-add-up-arrow = Tuʻu i te tahi ʻōfaʻi i niʻa
orbital-add-down-arrow = Tuʻu i te tahi ʻōfaʻi i raro
orbital-remove-arrow = Iriti ê i te ʻōfaʻi
orbital-row-label = Tāpaʻo nō te ʻāfata roa { $row }
pretzel-answer = Pāhonoraʻa

## Math input

math-input-preview-region = hiʻoraʻa nā mua o te parau numera
math-input-preview = Hiʻoraʻa nā mua
math-input-invalid-expression = Parau numera tano ʻore:

## Document status

viewer-initializing = Te haʻamata nei…

## Errors

error-heading = Hape
error-found-at =
    { $span ->
        [line] Ua ʻitehia i te reni { $startLine }.
       *[lines] Ua ʻitehia i te mau reni { $startLine }–{ $endLine }.
    }
document-contains-errors = Tē vai nei te hape i roto i teie papaʻiraʻa!
diagnostic-heading-error = Hape
diagnostic-heading-warning = Faʻaararaʻa
diagnostic-heading-information = Haʻamāramaramaraʻa
diagnostic-heading-hint = Aratairaʻa
accessibility-heading-level-1 = Ofatiraʻa i te ture ʻāravehi WCAG AA
accessibility-heading-level-2 = Faʻaararaʻa nō te ʻāravehi
something-went-wrong = Ua tupu te tahi hape.
renderer-load-failed = ʻaita te tahi renderer i hōhoʻahia. A tāmata faʻahou i te ʻāpī.
core-start-failed = ʻAita te hiʻoraʻa o te papaʻiraʻa i haʻamatahia. A tāmata faʻahou i te ʻāpī.
