# Lower Sorbian (dolnoserbšćina) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **The dual is alive here too, and CLDR knows it.**
# `Intl.PluralRules("dsb")` resolves to `dsb` with the same four categories
# Upper Sorbian has — `one`, `two`, `few`, `other` — so a `[two]` branch in
# this file is selected by Lower Sorbian's own rules: «jaden wopyt», «dwa
# wopyta», «tśi wopyty», «pěś wopytow». `chrome.test.ts` renders all four.
#
# **This file is not a respelling of `locales/hsb` and must not be edited into
# one.** Lower Sorbian is a separate written standard, and the two are
# expected to look alike — which is exactly why their agreement is *not*
# evidence that either is right: one process produced both. Where they part
# company they do so in the everyday words, not the technical ones: this file
# writes «wótegrono» where `locales/hsb` writes «wotmołwa», «pšašanje» for
# «prašenje», «cerwjeny» for «čerwjeny», «krejz» for «kruh», «bok» for
# «strona», «pśiducy» for «přichodny». The `ś` and `ź` of this orthography are
# letters of Lower Sorbian and have no counterpart in the Upper Sorbian file.
#
# **German is the contact language and the medium of schooling**, so a term
# this seed could not find in Sorbian is a German-shaped loan and is written as
# one: «funkcija», «wektor», «parabola», «matrica».


## Answer submission

answer-checking = Pśeglědujom…
answer-submitting = Sćelom…
answer-checking-status = Pśeglědujom wótegrono
answer-submitting-status = Sćelom wótegrono
answer-correct = Pšawje
answer-incorrect = Wopak
answer-response-saved = Wótegrono jo składowane
answer-percent-credit = { $percent } % dypkow
answer-percent-correct = { $percent } % pšawje
answer-percent-short = { $percent } %
max-credit-available = Nejwuše móžne dypki: { $percent } %
# All four categories, the dual included. «wopyt» is masculine inanimate:
# singular, dual «wopyta», plural «wopyty» after 3 and 4, genitive plural
# «wopytow» from 5 up.
attempts-remaining =
    { $count ->
        [0] žedne wopyty njewóstawaju
        [one] { $count } wopyt wóstawa
        [two] { $count } wopyta wóstawatej
        [few] { $count } wopyty wóstawaju
       *[other] { $count } wopytow wóstawa
    }
validation-correct = (Pšawje)
validation-incorrect = (Wopak)
validation-partially-correct = (Źělnje pšawje)
# «wótegrono» is neuter: singular, dual «wótegronje», plural «wótegrona»,
# genitive plural «wótegronow».
answer-show-responses =
    { $count ->
        [one] Pokaž { $count } wótegrono na { $answerId }
        [two] Pokaž { $count } wótegronje na { $answerId }
        [few] Pokaž { $count } wótegrona na { $answerId }
       *[other] Pokaž { $count } wótegronow na { $answerId }
    }

## Disclosure panels

feedback-heading = Wótegrono wucabnika
collapsible-click-to-open = (klikni, aby wócynił)
collapsible-click-to-close = (klikni, aby zacynił)
collapsible-initializing = Startujo se…
footnote-show = Pokaž nožku
footnote-hide = Schowaj nožku
description-more-information = wěcej informacijow

## Controls

slider-previous = Pjerwjejšny
slider-next = Pśiducy
keyboard-open = Wócyń tastaturu
keyboard-close = Zacyń tastaturu
choice-input-remove-choice = Wótpóraj { $choice }
matrix-remove-row = Wótpóraj smužku
matrix-add-row = Pśidaj smužku
matrix-remove-column = Wótpóraj słup
matrix-add-column = Pśidaj słup
subset-add-remove-points = Pśidaj / wótpóraj dypki
subset-toggle-points-intervals = Pśeměń mjazy dypkami a interwalami
subset-move-points = Pśesuń dypki
subset-clear = Wuprozni
orbital-add-row = Pśidaj smužku
orbital-remove-row = Wótpóraj smužku
orbital-add-box = Pśidaj kašćik
orbital-remove-box = Wótpóraj kašćik
orbital-add-up-arrow = Pśidaj šypku górjej
orbital-add-down-arrow = Pśidaj šypku dołoj
orbital-remove-arrow = Wótpóraj šypku
orbital-row-label = Pomjenjenje za smužku { $row }
pretzel-answer = Wótegrono

## Math input

math-input-preview-region = pśeglěd matematiskego wuraza
math-input-preview = Pśeglěd
math-input-invalid-expression = Njepłaśiwy wuraz:

## Document status

viewer-initializing = Startujo se…

## Errors

error-heading = Zmólk
error-found-at =
    { $span ->
        [line] Namakany w smužce { $startLine }.
       *[lines] Namakany w smužkach { $startLine }–{ $endLine }.
    }
document-contains-errors = Toś ten dokument wopśimujo zmólki!
diagnostic-heading-error = Zmólk
diagnostic-heading-warning = Warnowanje
diagnostic-heading-information = Informacija
diagnostic-heading-hint = Pokaz
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Pśestupjenje pśeśiwo WCAG AA za bźezbariernosć
accessibility-heading-level-2 = Naraźenje k bźezbariernosći
something-went-wrong = Něco njejo se raźiło.
renderer-load-failed = zwobraznjeński modul njedajo se zacytaś. Zacytaj bok znowego.
core-start-failed = Toś ten dokument njedajo se startowaś. Zacytaj bok znowego.
core-start-failed-busy = Toś ten dokument njedajo se startowaś. Wěcej dokumentow jo se naraz startowało, a na pómałem rěźe to dlej traja. Gaž su druge dokumenty gótowe, móžo znowegocytanje boka pomagaś.
core-start-failed-retry = Toś ten dokument njedajo se startowaś.
core-start-failed-busy-retry = Toś ten dokument njedajo se startowaś. Wěcej dokumentow jo se naraz startowało, a na pómałem rěźe to dlej traja.
core-start-retry = Wopytaj hyšći raz
saved-state-unavailable = Twójo składowane źěło njedajo se zacytaś.
