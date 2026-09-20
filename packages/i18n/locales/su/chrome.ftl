# Sundanese viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# SPEECH LEVEL. Sundanese chooses a register for every sentence the way
# Javanese does, and this catalog is written in **loma**, the neutral level,
# throughout — all four namespaces of it. Loma is the level Sundanese writing
# addressed to a general reader uses; a lemes catalog would be derived from it
# rather than the other way round, and a deployment that wants lemes supplies
# its own as `localeResources`, which wins over this one. A file with both
# levels in it would be wrong in either register, which is why the choice is
# made once here.
#
# Sundanese has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero. A noun is not marked for number, so
# «{ $count } kasempetan» is both "1 attempt" and "5 attempts".


## Answer submission

answer-checking = Mariksa...
answer-submitting = Ngirim...
answer-checking-status = Mariksa jawaban
answer-submitting-status = Ngirim jawaban
answer-correct = Bener
answer-incorrect = Salah
answer-response-saved = Jawaban Disimpen
answer-percent-credit = Peunteun { $percent }%
answer-percent-correct = Bener { $percent }%
answer-percent-short = { $percent }%
max-credit-available = Peunteun pangluhurna nu bisa kahontal: { $percent }%
attempts-remaining =
    { $count ->
        [0] teu aya kasempetan nu nyésa
       *[other] nyésa { $count } kasempetan
    }
validation-correct = (Bener)
validation-incorrect = (Salah)
validation-partially-correct = (Bener sabagian)
answer-show-responses = Témbongkeun { $count } jawaban pikeun { $answerId }

## Disclosure panels

feedback-heading = Tanggapan
collapsible-click-to-open = (klik pikeun muka)
collapsible-click-to-close = (klik pikeun nutup)
collapsible-initializing = Ngamimitian...
footnote-show = Témbongkeun catetan suku
footnote-hide = Nyumputkeun catetan suku
description-more-information = leuwih loba katerangan

## Controls

slider-previous = Saméméhna
slider-next = Salajengna
keyboard-open = Buka Papan Tombol
keyboard-close = Tutup Papan Tombol
choice-input-remove-choice = Piceun { $choice }
matrix-remove-row = Piceun baris
matrix-add-row = Tambah baris
matrix-remove-column = Piceun kolom
matrix-add-column = Tambah kolom
subset-add-remove-points = Tambah/Piceun titik
subset-toggle-points-intervals = Gonta-ganti titik jeung interval
subset-move-points = Pindahkeun Titik
subset-clear = Beresihan
orbital-add-row = Tambah Baris
orbital-remove-row = Piceun Baris
orbital-add-box = Tambah Kotak
orbital-remove-box = Piceun Kotak
orbital-add-up-arrow = Tambah Panah Ka Luhur
orbital-add-down-arrow = Tambah Panah Ka Handap
orbital-remove-arrow = Piceun Panah
orbital-row-label = Labél pikeun baris { $row }
pretzel-answer = Jawaban

## Math input

math-input-preview-region = pramidang éksprési matematika
math-input-preview = Pramidang
math-input-invalid-expression = Éksprési teu bener:

## Document status

viewer-initializing = Ngamimitian...

## Errors

error-heading = Kasalahan
error-found-at =
    { $span ->
        [line] Kapanggih dina baris { $startLine }.
       *[lines] Kapanggih dina baris { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokumén ieu ngandung kasalahan!
diagnostic-heading-error = Kasalahan
diagnostic-heading-warning = Pépéling
diagnostic-heading-information = Info
diagnostic-heading-hint = Pituduh
accessibility-heading-level-1 = Palanggaran Aksésibilitas WCAG AA
accessibility-heading-level-2 = Pépéling aksésibilitas
something-went-wrong = Aya nu salah.
renderer-load-failed = aya perénder nu gagal dimuat. Mangga muat deui kacana.
core-start-failed = Panempo dokumén teu bisa dimimitian. Mangga muat deui kacana.
