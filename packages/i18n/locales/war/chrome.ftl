# Waray viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin orthography of Waray publishing and of the Department of
# Education's mother-tongue materials for Samar and Leyte.
#
# Waray marks no number on the noun: plurality is carried by the article «an»
# against «an mga», and a noun after a numeral stays as it is. So a
# `{ $count -> … }` whose two English branches differ only in the noun renders
# one string here and the select is dropped; the count still arrives and is
# still formatted. A `[0]` branch stays wherever English has one, because "none
# left" is its own sentence rather than a form of the sentence beside it.
#
# The **linker** «nga» joins an adjective to what it describes. It has an
# enclitic form — `-ng` after a vowel — whose availability the *preceding* word
# decides, so this catalog writes the free «nga» everywhere. That form is
# grammatical in both places, which is what makes it safe in front of a
# placeable. `locales/ilo`, `locales/pam` and `locales/bik` have no such form,
# and each of those three has to say so. See `content.ftl`.


## Answer submission

answer-checking = Ginsususi…
answer-submitting = Ginpapadara…
answer-checking-status = Ginsususi an baton
answer-submitting-status = Ginpapadara an baton
answer-correct = Husto
answer-incorrect = Diri husto
answer-response-saved = Natipigan an baton
answer-percent-credit = { $percent }% nga kredito
answer-percent-correct = { $percent }% nga husto
answer-percent-short = { $percent } %
max-credit-available = Pinakahitaas nga kredito nga makukuha: { $percent }%
# No select: «pagsari» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] waray na nahabilin nga pagsari
       *[other] { $count } nga pagsari an nahabilin
    }
validation-correct = (Husto)
validation-incorrect = (Diri husto)
validation-partially-correct = (Husto ha bahin)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Ipakita an { $count } nga baton para ha { $answerId }

## Disclosure panels

feedback-heading = Komento
collapsible-click-to-open = (i-klik basi maabrihan)
collapsible-click-to-close = (i-klik basi masarhan)
collapsible-initializing = Nagtitikang…
footnote-show = Ipakita an footnote
footnote-hide = Itago an footnote
description-more-information = dugang nga impormasyon

## Controls

slider-previous = Nahiuna
slider-next = Sunod
keyboard-open = Abrihi an teklado
keyboard-close = Sarhi an teklado
choice-input-remove-choice = Kuhaa an { $choice }
matrix-remove-row = Kuhaa an linya
matrix-add-row = Dugangi hin linya
matrix-remove-column = Kuhaa an kolum
matrix-add-column = Dugangi hin kolum
subset-add-remove-points = Pagdugang/Pagkuha hin mga punto
subset-toggle-points-intervals = Pagbalyo hin mga punto ngan interbalo
subset-move-points = Ibalhin an mga punto
subset-clear = Limpyohi
orbital-add-row = Dugangi hin linya
orbital-remove-row = Kuhaa an linya
orbital-add-box = Dugangi hin kahon
orbital-remove-box = Kuhaa an kahon
orbital-add-up-arrow = Dugangi hin pana nga pasaka
orbital-add-down-arrow = Dugangi hin pana nga palugsad
orbital-remove-arrow = Kuhaa an pana
orbital-row-label = Etiketa para ha linya { $row }
pretzel-answer = Baton

## Math input

math-input-preview-region = pahiuna nga pagkita han ekspresyon nga matematika
math-input-preview = Pahiuna nga pagkita
math-input-invalid-expression = Imbalido nga ekspresyon:

## Document status

viewer-initializing = Nagtitikang…

## Errors

error-heading = Sayop
error-found-at =
    { $span ->
        [line] Nakit-an ha linya { $startLine }.
       *[lines] Nakit-an ha mga linya { $startLine }–{ $endLine }.
    }
document-contains-errors = May-ada sayop ini nga dokumento!
diagnostic-heading-error = Sayop
diagnostic-heading-warning = Pahamangno
diagnostic-heading-information = Impormasyon
diagnostic-heading-hint = Giya
accessibility-heading-level-1 = Paglapas ha aksesibilidad nga WCAG AA
accessibility-heading-level-2 = Pahamangno mahitungod ha aksesibilidad
something-went-wrong = May-ada nasayop.
renderer-load-failed = may renderer nga waray ma-load. Alayon i-reload an pahina.
core-start-failed = Diri natikang an pagkita han dokumento. Alayon i-reload an pahina.
