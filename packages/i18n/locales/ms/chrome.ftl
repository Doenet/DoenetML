# Malay viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Malay has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero, because that is a different sentence
# rather than a different number.
#
# Nouns are not marked for number, so «{ $count } percubaan» is both "1
# attempt" and "5 attempts".


## Answer submission

answer-checking = Menyemak...
answer-submitting = Menghantar...
answer-checking-status = Menyemak jawapan
answer-submitting-status = Menghantar jawapan
answer-correct = Betul
answer-incorrect = Salah
answer-response-saved = Jawapan Disimpan
answer-percent-credit = { $percent }% Markah
answer-percent-correct = { $percent }% Betul
answer-percent-short = { $percent }%
max-credit-available = Markah maksimum yang boleh diperoleh: { $percent }%
attempts-remaining =
    { $count ->
        [0] tiada percubaan berbaki
       *[other] { $count } percubaan berbaki
    }
validation-correct = (Betul)
validation-incorrect = (Salah)
validation-partially-correct = (Betul sebahagian)
answer-show-responses = Tunjukkan { $count } jawapan kepada { $answerId }

## Disclosure panels

feedback-heading = Maklum Balas
collapsible-click-to-open = (klik untuk buka)
collapsible-click-to-close = (klik untuk tutup)
collapsible-initializing = Memulakan...
footnote-show = Tunjukkan nota kaki
footnote-hide = Sembunyikan nota kaki
description-more-information = maklumat lanjut

## Controls

# English clips "Previous" to "Prev" to fit the button. Malay has no such
# short form, so both words are written in full here, as `paginator-previous`
# and `paginator-next` are.
slider-previous = Sebelumnya
slider-next = Seterusnya
keyboard-open = Buka Papan Kekunci
keyboard-close = Tutup Papan Kekunci
choice-input-remove-choice = Buang { $choice }
matrix-remove-row = Buang baris
matrix-add-row = Tambah baris
matrix-remove-column = Buang lajur
matrix-add-column = Tambah lajur
subset-add-remove-points = Tambah/Buang titik
subset-toggle-points-intervals = Tukar antara titik dan selang
subset-move-points = Alih Titik
subset-clear = Kosongkan
# A `box` here is one orbital, drawn as a square: kotak.
orbital-add-row = Tambah Baris
orbital-remove-row = Buang Baris
orbital-add-box = Tambah Kotak
orbital-remove-box = Buang Kotak
orbital-add-up-arrow = Tambah Anak Panah Atas
orbital-add-down-arrow = Tambah Anak Panah Bawah
orbital-remove-arrow = Buang Anak Panah
orbital-row-label = Label bagi baris { $row }
pretzel-answer = Jawapan

## Math input

math-input-preview-region = pratonton ungkapan matematik
math-input-preview = Pratonton
math-input-invalid-expression = Ungkapan tidak sah:

## Document status

viewer-initializing = Memulakan...

## Errors

error-heading = Ralat
error-found-at =
    { $span ->
        [line] Ditemui pada baris { $startLine }.
       *[lines] Ditemui pada baris { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokumen ini mengandungi ralat!
diagnostic-heading-error = Ralat
diagnostic-heading-warning = Amaran
diagnostic-heading-information = Maklumat
diagnostic-heading-hint = Petunjuk
accessibility-heading-level-1 = Pelanggaran Kebolehcapaian WCAG AA
accessibility-heading-level-2 = Amaran kebolehcapaian
something-went-wrong = Ada sesuatu yang tidak kena.
renderer-load-failed = satu pemapar gagal dimuatkan. Sila muat semula halaman ini.
core-start-failed = Pemapar dokumen tidak dapat dimulakan. Sila muat semula halaman ini.
