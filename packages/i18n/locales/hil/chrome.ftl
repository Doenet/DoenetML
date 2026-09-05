# Hiligaynon viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin orthography of Hiligaynon publishing and of the
# Department of Education's mother-tongue materials for Western Visayas. The
# language is also called Ilonggo; `hil` is the code and CLDR names it
# Hiligaynon, which is what the roster shows.
#
# Hiligaynon marks no number on the noun: plurality is carried by «ang mga» and
# a noun after a numeral stays as it is. So a `{ $count -> … }` whose two
# English branches differ only in the noun renders one string here and the
# select is dropped; the count still arrives and is still formatted. A `[0]`
# branch stays wherever English has one.
#
# The linker «nga» is written in full at every site, for the reason given in
# `content.ftl`.


## Answer submission

answer-checking = Ginausisa…
answer-submitting = Ginapadala…
answer-checking-status = Ginausisa ang sabat
answer-submitting-status = Ginapadala ang sabat
answer-correct = Husto
answer-incorrect = Indi husto
answer-response-saved = Natipigan ang sabat
answer-percent-credit = { $percent }% nga kredito
answer-percent-correct = { $percent }% nga husto
answer-percent-short = { $percent } %
max-credit-available = Pinakamataas nga kredito nga mabaton: { $percent }%
# No select: «tilaw» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] wala na sing nabilin nga tilaw
       *[other] { $count } nga tilaw ang nabilin
    }
validation-correct = (Husto)
validation-incorrect = (Indi husto)
validation-partially-correct = (Husto sa bahin)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Ipakita ang { $count } nga sabat para sa { $answerId }

## Disclosure panels

feedback-heading = Komento
collapsible-click-to-open = (i-klik agod mabuksan)
collapsible-click-to-close = (i-klik agod matakpan)
collapsible-initializing = Ginasugdan…
footnote-show = Ipakita ang footnote
footnote-hide = Itago ang footnote
description-more-information = dugang nga impormasyon

## Controls

slider-previous = Nagligad
slider-next = Sunod
keyboard-open = Buksi ang teklado
keyboard-close = Takpi ang teklado
choice-input-remove-choice = Kuhaa ang { $choice }
matrix-remove-row = Kuhaa ang lakan
matrix-add-row = Dugangi sing lakan
matrix-remove-column = Kuhaa ang kolum
matrix-add-column = Dugangi sing kolum
subset-add-remove-points = Pagdugang/Pagkuha sing mga punto
subset-toggle-points-intervals = Pagbaylo sing mga punto kag interbalo
subset-move-points = Ibalhin ang mga punto
subset-clear = Limpyuhi
orbital-add-row = Dugangi sing lakan
orbital-remove-row = Kuhaa ang lakan
orbital-add-box = Dugangi sing kahon
orbital-remove-box = Kuhaa ang kahon
orbital-add-up-arrow = Dugangi sing pana nga pasaka
orbital-add-down-arrow = Dugangi sing pana nga padulhog
orbital-remove-arrow = Kuhaa ang pana
orbital-row-label = Etiketa para sa lakan { $row }
pretzel-answer = Sabat

## Math input

math-input-preview-region = pahiuna nga pagtan-aw sang ekspresyon nga matematika
math-input-preview = Pahiuna nga pagtan-aw
math-input-invalid-expression = Indi balido nga ekspresyon:

## Document status

viewer-initializing = Ginasugdan…

## Errors

error-heading = Sayop
error-found-at =
    { $span ->
        [line] Nakita sa linya { $startLine }.
       *[lines] Nakita sa mga linya { $startLine }–{ $endLine }.
    }
document-contains-errors = May sayop ini nga dokumento!
diagnostic-heading-error = Sayop
diagnostic-heading-warning = Paandam
diagnostic-heading-information = Impormasyon
diagnostic-heading-hint = Giya
accessibility-heading-level-1 = Paglapas sa aksesibilidad nga WCAG AA
accessibility-heading-level-2 = Paandam parte sa aksesibilidad
something-went-wrong = May nagsayop.
renderer-load-failed = may renderer nga wala na-load. Palihog i-reload ang pahina.
core-start-failed = Wala nagsugod ang pagtan-aw sang dokumento. Palihog i-reload ang pahina.
