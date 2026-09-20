# Upper Sorbian (hornjoserbšćina) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **The dual is alive here, and CLDR knows it.** Upper Sorbian is one of the
# few living Slavic languages with a grammatical dual, and
# `Intl.PluralRules("hsb")` resolves to `hsb` with four categories — `one`,
# `two`, `few`, `other` — so a `[two]` branch in this file is selected by
# Sorbian's own rules rather than by the runtime's default language: «jedyn
# pospyt», «dwaj pospytaj», «tři pospyty», «pjeć pospytow». `chrome.test.ts`
# renders all four. This is not the roster's first dual — `locales/sl`,
# `locales/sat`, the Sami catalogs and the Semitic and Celtic ones all write a
# `[two]` their own data selects — and not its first four-branch plural
# either; it is the first that arrives as a pair of neighbouring standards,
# which is what the note in `content.ftl` is about.
#
# `locales/dsb` beside it is the same language family and the same four
# categories, and the two catalogs are deliberately **not** respellings of each
# other — see the note in `content.ftl`.
#
# **German is the contact language and the medium of schooling**, so a term
# this seed could not find in Sorbian is a German-shaped loan and is written as
# one: «funkcija», «wektor», «parabola», «matrica». Sorbian's own orthography
# is used throughout — «č ć ě ł ń ó ř š ž» — and the ligature-free digraphs
# «dź» and «tř» are two letters each, not one.


## Answer submission

answer-checking = Přepruwuju…
answer-submitting = Sćelu…
answer-checking-status = Přepruwuju wotmołwu
answer-submitting-status = Sćelu wotmołwu
answer-correct = Prawje
answer-incorrect = Wopak
answer-response-saved = Wotmołwa je składowana
answer-percent-credit = { $percent } % dypkow
answer-percent-correct = { $percent } % prawje
answer-percent-short = { $percent } %
max-credit-available = Najwyše móžne dypki: { $percent } %
# The batch's one four-branch plural, and every branch of it is selected by
# `hsb`'s own CLDR rules. «pospyt» is masculine inanimate: nominative singular,
# nominative dual «pospytaj», nominative plural «pospyty» after 3 and 4, and
# the genitive plural «pospytow» from 5 up.
attempts-remaining =
    { $count ->
        [0] žane pospyty njezbywaja
        [one] { $count } pospyt zbywa
        [two] { $count } pospytaj zbywatej
        [few] { $count } pospyty zbywaja
       *[other] { $count } pospytow zbywa
    }
validation-correct = (Prawje)
validation-incorrect = (Wopak)
validation-partially-correct = (Zdźěla prawje)
# «wotmołwa» is feminine, and the counted forms stand in the accusative after
# «Pokaž»: singular «wotmołwu», dual «wotmołwje», plural «wotmołwy», genitive
# plural «wotmołwow».
answer-show-responses =
    { $count ->
        [one] Pokaž { $count } wotmołwu na { $answerId }
        [two] Pokaž { $count } wotmołwje na { $answerId }
        [few] Pokaž { $count } wotmołwy na { $answerId }
       *[other] Pokaž { $count } wotmołwow na { $answerId }
    }

## Disclosure panels

feedback-heading = Wotmołwa wučerja
collapsible-click-to-open = (klikń, zo by wotewrěł)
collapsible-click-to-close = (klikń, zo by začinił)
collapsible-initializing = Startuje so…
footnote-show = Pokaž nóžku
footnote-hide = Schowaj nóžku
description-more-information = wjace informacijow

## Controls

slider-previous = Předchadny
slider-next = Přichodny
keyboard-open = Wotewri tastaturu
keyboard-close = Začiń tastaturu
choice-input-remove-choice = Wotstroń { $choice }
matrix-remove-row = Wotstroń linku
matrix-add-row = Přidaj linku
matrix-remove-column = Wotstroń špaltu
matrix-add-column = Přidaj špaltu
subset-add-remove-points = Přidaj / wotstroń dypki
subset-toggle-points-intervals = Přeměń mjez dypkami a interwalami
subset-move-points = Přesuń dypki
subset-clear = Wuprózdni
orbital-add-row = Přidaj linku
orbital-remove-row = Wotstroń linku
orbital-add-box = Přidaj kašćik
orbital-remove-box = Wotstroń kašćik
orbital-add-up-arrow = Přidaj šipk horje
orbital-add-down-arrow = Přidaj šipk dele
orbital-remove-arrow = Wotstroń šipk
orbital-row-label = Pomjenowanje za linku { $row }
pretzel-answer = Wotmołwa

## Math input

math-input-preview-region = přehlad matematiskeho wurazu
math-input-preview = Přehlad
math-input-invalid-expression = Njepłaćiwy wuraz:

## Document status

viewer-initializing = Startuje so…

## Errors

error-heading = Zmylk
error-found-at =
    { $span ->
        [line] Namakany na lince { $startLine }.
       *[lines] Namakany na linkach { $startLine }–{ $endLine }.
    }
document-contains-errors = Tutón dokument wobsahuje zmylki!
diagnostic-heading-error = Zmylk
diagnostic-heading-warning = Warnowanje
diagnostic-heading-information = Informacija
diagnostic-heading-hint = Pokiw
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Přeńdźenje přećiwo WCAG AA za bjezbarjernosć
accessibility-heading-level-2 = Namjet k bjezbarjernosći
something-went-wrong = Něšto njeje so poradźiło.
renderer-load-failed = zwobraznjenski modul njeda so začitać. Začitaj stronu znowa.
core-start-failed = Tutón dokument njeda so startować. Začitaj stronu znowa.
core-start-failed-busy = Tutón dokument njeda so startować. Wjacore dokumenty su so naraz startowali, a na pomałym graće to dlěje traje. Hdyž druhe dokumenty hotowe su, móže znowastartowanje strony pomhać.
core-start-failed-retry = Tutón dokument njeda so startować.
core-start-failed-busy-retry = Tutón dokument njeda so startować. Wjacore dokumenty su so naraz startowali, a na pomałym graće to dlěje traje.
core-start-retry = Spytaj hišće raz
saved-state-unavailable = Twoje składowane dźěło njeda so začitać.
