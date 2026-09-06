# Minangkabau viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin orthography of Minangkabau publishing, which spells the
# language's own vowels rather than Indonesian's: «garih» and not «garis»,
# «itam» and not «hitam», «taba» and not «tebal». Minangkabau is Malayic and a
# great deal of its vocabulary is shared with `locales/id` and `locales/ms`; a
# corrector's most useful check is where this file agrees with them and should
# not.
#
# Minangkabau marks no number on the noun — reduplication is available but
# optional, and a count in front of the noun does the work — so a
# `{ $count -> … }` whose two English branches differ only in the noun renders
# one string here and the select is dropped. A `[0]` branch stays wherever
# English has one.


## Answer submission

answer-checking = Mamareso…
answer-submitting = Mangirim…
answer-checking-status = Mamareso jawaban
answer-submitting-status = Mangirim jawaban
answer-correct = Batua
answer-incorrect = Indak batua
answer-response-saved = Jawaban alah disimpan
answer-percent-credit = { $percent }% kredit
answer-percent-correct = { $percent }% batua
answer-percent-short = { $percent } %
max-credit-available = Kredit paliang gadang nan bisa didapek: { $percent }%
# No select: «cubo» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] indak ado cubo nan tingga lai
       *[other] tingga { $count } cubo
    }
validation-correct = (Batua)
validation-incorrect = (Indak batua)
validation-partially-correct = (Batua sabagian)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Tampilkan { $count } jawaban untuak { $answerId }

## Disclosure panels

feedback-heading = Komentar
collapsible-click-to-open = (klik untuak mambukak)
collapsible-click-to-close = (klik untuak manutuik)
collapsible-initializing = Mamulai…
footnote-show = Tampilkan footnote
footnote-hide = Sambunyian footnote
description-more-information = katarangan tambahan

## Controls

slider-previous = Sabalunnyo
slider-next = Salanjuiknyo
keyboard-open = Bukak papan tuts
keyboard-close = Tutuik papan tuts
choice-input-remove-choice = Hapuih { $choice }
matrix-remove-row = Hapuih barih
matrix-add-row = Tambah barih
matrix-remove-column = Hapuih kolom
matrix-add-column = Tambah kolom
subset-add-remove-points = Tambah/Hapuih titiak
subset-toggle-points-intervals = Tuka titiak jo interval
subset-move-points = Pindahkan titiak
subset-clear = Basiahkan
orbital-add-row = Tambah barih
orbital-remove-row = Hapuih barih
orbital-add-box = Tambah kotak
orbital-remove-box = Hapuih kotak
orbital-add-up-arrow = Tambah panah ka ateh
orbital-add-down-arrow = Tambah panah ka bawah
orbital-remove-arrow = Hapuih panah
orbital-row-label = Label untuak barih { $row }
pretzel-answer = Jawaban

## Math input

math-input-preview-region = pratinjau ungkapan matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ungkapan nan indak sah:

## Document status

viewer-initializing = Mamulai…

## Errors

error-heading = Kasalahan
error-found-at =
    { $span ->
        [line] Basuo di barih { $startLine }.
       *[lines] Basuo di barih { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokumen ko ado kasalahan!
diagnostic-heading-error = Kasalahan
diagnostic-heading-warning = Peringatan
diagnostic-heading-information = Katarangan
diagnostic-heading-hint = Pituah
accessibility-heading-level-1 = Palanggaran aksesibilitas WCAG AA
accessibility-heading-level-2 = Peringatan tantang aksesibilitas
something-went-wrong = Ado nan salah.
renderer-load-failed = ado renderer nan indak tamuek. Tolong muek ulang laman ko.
core-start-failed = Panampil dokumen indak bisa dimulai. Tolong muek ulang laman ko.
