# Indonesian viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Indonesian has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero, because that is a different sentence
# rather than a different number.
#
# Nouns are not marked for number: `{ $count } percobaan` is both "1 attempt"
# and "5 attempts". Reduplication (percobaan-percobaan) marks plurality only
# when no number is present, so it is wrong here.


## Answer submission

answer-checking = Memeriksa...
answer-submitting = Mengirim...
answer-checking-status = Memeriksa jawaban
answer-submitting-status = Mengirim jawaban
answer-correct = Benar
answer-incorrect = Salah
answer-response-saved = Jawaban tersimpan
answer-percent-credit = Nilai { $percent }%
answer-percent-correct = { $percent }% benar
answer-percent-short = { $percent }%
max-credit-available = Nilai maksimum yang tersedia: { $percent }%
attempts-remaining =
    { $count ->
        [0] tidak ada percobaan tersisa
       *[other] tersisa { $count } percobaan
    }
validation-correct = (Benar)
validation-incorrect = (Salah)
validation-partially-correct = (Sebagian benar)
answer-show-responses = Tampilkan { $count } jawaban untuk { $answerId }

## Disclosure panels

feedback-heading = Umpan balik
collapsible-click-to-open = (klik untuk membuka)
collapsible-click-to-close = (klik untuk menutup)
collapsible-initializing = Menyiapkan...
footnote-show = Tampilkan catatan kaki
footnote-hide = Sembunyikan catatan kaki
description-more-information = informasi lebih lanjut

## Controls

slider-previous = Sebelumnya
slider-next = Berikutnya
keyboard-open = Buka papan ketik
keyboard-close = Tutup papan ketik
choice-input-remove-choice = Hapus { $choice }
matrix-remove-row = Hapus baris
matrix-add-row = Tambah baris
matrix-remove-column = Hapus kolom
matrix-add-column = Tambah kolom
subset-add-remove-points = Tambah/Hapus titik
subset-toggle-points-intervals = Alihkan titik dan selang
subset-move-points = Pindahkan titik
subset-clear = Bersihkan
# A `box` here is one orbital, drawn as a square: kotak.
orbital-add-row = Tambah baris
orbital-remove-row = Hapus baris
orbital-add-box = Tambah kotak
orbital-remove-box = Hapus kotak
orbital-add-up-arrow = Tambah panah atas
orbital-add-down-arrow = Tambah panah bawah
orbital-remove-arrow = Hapus panah
orbital-row-label = Label untuk baris { $row }
pretzel-answer = Jawaban

## Math input

math-input-preview-region = pratinjau ekspresi matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ekspresi tidak valid:

## Document status

viewer-initializing = Menyiapkan...

## Errors

error-heading = Kesalahan
error-found-at =
    { $span ->
        [line] Ditemukan pada baris { $startLine }.
       *[lines] Ditemukan pada baris { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokumen ini mengandung kesalahan!
diagnostic-heading-error = Kesalahan
diagnostic-heading-warning = Peringatan
diagnostic-heading-information = Info
diagnostic-heading-hint = Petunjuk
accessibility-heading-level-1 = Pelanggaran aksesibilitas WCAG AA
accessibility-heading-level-2 = Peringatan aksesibilitas
something-went-wrong = Terjadi kesalahan.
renderer-load-failed = sebuah perender gagal dimuat. Silakan muat ulang halaman.
core-start-failed = Penampil dokumen tidak dapat dijalankan. Silakan muat ulang halaman.
