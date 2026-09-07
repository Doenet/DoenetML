# Bikol viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `bik` is an ISO 639-3 **macrolanguage** covering the Bikol languages of the
# Bicol peninsula, and this catalog is written in **Central Bikol** (Naga), the
# variety Bikol publishing, broadcasting and the Department of Education's
# mother-tongue materials use. A reader arriving under one of the other members
# — `bcl`, `bto`, `cts`, `bln` and the rest — reaches it through
# `MACROLANGUAGE_MEMBERS` in `negotiate.ts`, which is the same service
# `locales/qu` and `locales/gn` already get.
#
# Bikol marks no number on the noun: plurality is carried by «mga» and a noun
# after a numeral stays as it is. So a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped; the count still arrives and is still formatted. A `[0]` branch stays
# wherever English has one.
#
# The linker «na»/«-ng» is written as the free «na» wherever it lands beside a
# placeable; see `content.ftl` for what that gets right and what it does not.


## Answer submission

answer-checking = Sinisiyasat…
answer-submitting = Ipinapadara…
answer-checking-status = Sinisiyasat an simbag
answer-submitting-status = Ipinapadara an simbag
answer-correct = Tama
answer-incorrect = Bakong tama
answer-response-saved = Natago an simbag
answer-percent-credit = { $percent }% na kredito
answer-percent-correct = { $percent }% na tama
answer-percent-short = { $percent } %
max-credit-available = Pinakahalangkaw na kreditong makukua: { $percent }%
# No select: «purbar» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] mayo nang natadang purbar
       *[other] { $count } na purbar an natada
    }
validation-correct = (Tama)
validation-incorrect = (Bakong tama)
validation-partially-correct = (Tama sa kabtang)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Ipahiling an { $count } na simbag para sa { $answerId }

## Disclosure panels

feedback-heading = Komento
collapsible-click-to-open = (i-klik tanganing mabuksan)
collapsible-click-to-close = (i-klik tanganing masarahan)
collapsible-initializing = Nagpopoon…
footnote-show = Ipahiling an footnote
footnote-hide = Itago an footnote
description-more-information = dagdag na impormasyon

## Controls

slider-previous = Nakaagi
slider-next = Sunod
keyboard-open = Buksan an teklado
keyboard-close = Sarahan an teklado
choice-input-remove-choice = Halion an { $choice }
matrix-remove-row = Halion an linya
matrix-add-row = Dagdagan nin linya
matrix-remove-column = Halion an kolum
matrix-add-column = Dagdagan nin kolum
subset-add-remove-points = Pagdagdag/Paghali nin mga punto
subset-toggle-points-intervals = Pagsalyo nin mga punto asin interbalo
subset-move-points = Ibalyo an mga punto
subset-clear = Linigan
orbital-add-row = Dagdagan nin linya
orbital-remove-row = Halion an linya
orbital-add-box = Dagdagan nin kahon
orbital-remove-box = Halion an kahon
orbital-add-up-arrow = Dagdagan nin panang pasiring sa itaas
orbital-add-down-arrow = Dagdagan nin panang pasiring sa ibaba
orbital-remove-arrow = Halion an pana
orbital-row-label = Etiketa para sa linya { $row }
pretzel-answer = Simbag

## Math input

math-input-preview-region = enot na pagheling sa ekspresyon na matematika
math-input-preview = Enot na pagheling
math-input-invalid-expression = Bakong balidong ekspresyon:

## Document status

viewer-initializing = Nagpopoon…

## Errors

error-heading = Sala
error-found-at =
    { $span ->
        [line] Nakua sa linya { $startLine }.
       *[lines] Nakua sa mga linya { $startLine }–{ $endLine }.
    }
document-contains-errors = Igwang sala ining dokumento!
diagnostic-heading-error = Sala
diagnostic-heading-warning = Patanid
diagnostic-heading-information = Impormasyon
diagnostic-heading-hint = Giya
accessibility-heading-level-1 = Paglapas sa aksesibilidad na WCAG AA
accessibility-heading-level-2 = Patanid manongod sa aksesibilidad
something-went-wrong = Igwang nagkasala.
renderer-load-failed = igwang renderer na dai na-load. Pakiulit i-load an pahina.
core-start-failed = Dai nagpoon an pagheling kan dokumento. Pakiulit i-load an pahina.
