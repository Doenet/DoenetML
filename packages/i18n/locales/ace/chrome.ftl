# Acehnese viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** orthography Acehnese publishing and schooling use,
# with the diacritics that spell the language's own vowels — «putéh», «titék»,
# «jaweueb». Acehnese is also written in Jawi, the Arabic script, so a reader
# arriving under `ace-Arab` reaches this and gets Latin: the asymmetry `pa`,
# `sr`, `jv` and `su` already have, and the answer to it is a second catalog
# beside this one rather than a rename of it.
#
# Acehnese marks no number on the noun, so a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped. A `[0]` branch stays wherever English has one.


## Answer submission

answer-checking = Teungoh geupeuréksa…
answer-submitting = Teungoh geukirém…
answer-checking-status = Teungoh geupeuréksa jaweueb
answer-submitting-status = Teungoh geukirém jaweueb
answer-correct = Beutôi
answer-incorrect = Hana beutôi
answer-response-saved = Jaweueb ka geusimpan
answer-percent-credit = { $percent }% kredit
answer-percent-correct = { $percent }% beutôi
answer-percent-short = { $percent } %
max-credit-available = Kredit paléng rayeuk nyang jeuet teuhah: { $percent }%
# No select: «cuba» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] hana lé cuba nyang teungoh
       *[other] na { $count } cuba teungoh
    }
validation-correct = (Beutôi)
validation-incorrect = (Hana beutôi)
validation-partially-correct = (Beutôi siseun bagian)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Peuleumah { $count } jaweueb keu { $answerId }

## Disclosure panels

feedback-heading = Komentar
collapsible-click-to-open = (klik keu jeuet buka)
collapsible-click-to-close = (klik keu jeuet tôb)
collapsible-initializing = Teungoh peuphon…
footnote-show = Peuleumah footnote
footnote-hide = Som footnote
description-more-information = keterangan laén

## Controls

slider-previous = Sigohlom
slider-next = Seulanjut
keyboard-open = Buka papan tuts
keyboard-close = Tôb papan tuts
choice-input-remove-choice = Peugadôh { $choice }
matrix-remove-row = Peugadôh barih
matrix-add-row = Tamah barih
matrix-remove-column = Peugadôh kolom
matrix-add-column = Tamah kolom
subset-add-remove-points = Tamah/Peugadôh titék
subset-toggle-points-intervals = Tuka titék ngon interval
subset-move-points = Peupinah titék
subset-clear = Peugleh
orbital-add-row = Tamah barih
orbital-remove-row = Peugadôh barih
orbital-add-box = Tamah kutak
orbital-remove-box = Peugadôh kutak
orbital-add-up-arrow = Tamah panah u ateuh
orbital-add-down-arrow = Tamah panah u yup
orbital-remove-arrow = Peugadôh panah
orbital-row-label = Label keu barih { $row }
pretzel-answer = Jaweueb

## Math input

math-input-preview-region = pratinjau ungkapan matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ungkapan nyang hana sah:

## Document status

viewer-initializing = Teungoh peuphon…

## Errors

error-heading = Salah
error-found-at =
    { $span ->
        [line] Meuteumeung bak barih { $startLine }.
       *[lines] Meuteumeung bak barih { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokumen nyoe na salah!
diagnostic-heading-error = Salah
diagnostic-heading-warning = Peuingat
diagnostic-heading-information = Keterangan
diagnostic-heading-hint = Peutunyok
accessibility-heading-level-1 = Peulanggaran aksesibilitas WCAG AA
accessibility-heading-level-2 = Peuingat keuhai aksesibilitas
something-went-wrong = Na nyang hana beutôi.
renderer-load-failed = na renderer nyang hana ék teumuka. Neupeuulang muat laman nyoe.
core-start-failed = Peuleumah dokumen hana ék teupeuphon. Neupeuulang muat laman nyoe.
