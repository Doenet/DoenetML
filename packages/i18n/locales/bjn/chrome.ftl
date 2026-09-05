# Banjar (Bahasa Banjar) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and orthography.** Banjar is a Malayic language of South Kalimantan
# with two dialect groups, Banjar Hulu and Banjar Kuala. This catalog writes
# the **Banjar Hulu** vowel system, which is the one Banjar writing normally
# uses: three vowels, `a i u`, so Indonesian's `e` and `o` are written `a`, `i`
# and `u` — «barasih» for *bersih*, «cuklat» for *coklat*, «kandal» for
# *tebal*. A Banjar Kuala reader will recognize the words and may prefer to
# respell some of them; that is a spelling change and not a translation change.
# The orthography is the ordinary Indonesian Latin one, with no diacritics.
#
# **The technical register is Indonesian, and that is not a shortcut.** Banjar
# speakers are schooled in Indonesian, and the words for a component, an
# attribute, a matrix or a percentage are the Indonesian ones because those are
# the words the community actually uses. They are written here as Indonesian
# rather than respelled into a Banjar shape the language does not give them.
#
# **What is Banjar, and what a reviewer should check first.** The risk in a
# Malayic catalog is that it becomes Indonesian with a few words changed. What
# holds this one apart from `locales/id` is the everyday layer, and it is used
# consistently: «kada» for *tidak* and «kadada» for *tidak ada*, «kawa» for
# *bisa/dapat* (so *cannot* is «kada kawa»), «nang» for *yang*, «gasan» for
# *untuk*, «matan» for *dari*, «lawan» for *dengan*, «wan» for *dan*, «atawa»
# for *atau*, «amun» for *jika*, «tagal» for *tetapi*, «lantaran» for *karena*,
# «barataan» for *semua*, «ganal» and «halus» for *besar* and *kecil*, «bujur»
# for *benar*, «katamu» for *ditemukan*, «pulang» for *lagi*, «jua» for *juga*,
# «balum» for *belum*, and «pian» as the polite second person. A message where
# «tidak», «yang», «untuk», «dari», «dengan» or «jika» has crept back in is a
# mistake, not a variant.
#
# **The reader is addressed as «pian»**, the polite second person, and only
# `saved-state-unavailable` and `core-start-failed*` address them at all. The
# rest are labels and headings with no addressee.
#
# **Counts.** CLDR has no plural data for `bjn`, so `Intl.PluralRules` would
# resolve it against the runtime's own locale and any `[one]` branch would be
# selected by English's rules rather than by Banjar's. The two counted messages
# here collapse to a single `*[other]`, keeping only `attempts-remaining`'s
# explicit `[0]`, which Fluent matches against the number itself. A Banjar noun
# is unmarked after a numeral anyway, so one form is correct.


## Answer submission — the check-work button and the status it reports.

answer-checking = Mamariksa...
answer-submitting = Mangirim...

answer-checking-status = Mamariksa jawaban
answer-submitting-status = Mangirim jawaban

answer-correct = Bujur
answer-incorrect = Salah

answer-response-saved = Jawaban sudah disimpan

answer-percent-credit = Nilai { $percent }%
answer-percent-correct = { $percent }% bujur
answer-percent-short = { $percent } %

max-credit-available = Nilai paling ganal nang kawa didapat: { $percent }%

attempts-remaining =
    { $count ->
        [0] kadada lagi cuba nang tasisa
       *[other] tasisa { $count } kali cuba
    }

validation-correct = (Bujur)
validation-incorrect = (Salah)
validation-partially-correct = (Sabagian bujur)

answer-show-responses = Tunjukakan { $count } jawaban gasan { $answerId }


## Disclosure panels

feedback-heading = Umpan balik

collapsible-click-to-open = (klik gasan mambuka)
collapsible-click-to-close = (klik gasan manutup)

collapsible-initializing = Lagi disiapakan...

footnote-show = Tunjukakan catatan bawah
footnote-hide = Sumbunyiakan catatan bawah

description-more-information = katarangan labih lanjut


## Controls

slider-previous = Sabalumnya
slider-next = Barikutnya

keyboard-open = Buka papan katik
keyboard-close = Tutup papan katik

choice-input-remove-choice = Hapus { $choice }

matrix-remove-row = Hapus baris
matrix-add-row = Tambah baris
matrix-remove-column = Hapus kolom
matrix-add-column = Tambah kolom

subset-add-remove-points = Tambah/Hapus titik
subset-toggle-points-intervals = Alihakan titik lawan salang
subset-move-points = Pindahakan titik
subset-clear = Barasihakan

orbital-add-row = Tambah baris
orbital-remove-row = Hapus baris
orbital-add-box = Tambah kutak
orbital-remove-box = Hapus kutak
orbital-add-up-arrow = Tambah anak panah ka atas
orbital-add-down-arrow = Tambah anak panah ka bawah
orbital-remove-arrow = Hapus anak panah

orbital-row-label = Label gasan baris { $row }

pretzel-answer = Jawaban



## Math input

math-input-preview-region = pratinjau ungkapan matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ungkapan kada sah:


## Document status

viewer-initializing = Lagi disiapakan...


## Errors

error-heading = Kasalahan

error-found-at =
    { $span ->
        [line] Katamu di baris { $startLine }.
       *[lines] Katamu di baris { $startLine }–{ $endLine }.
    }

document-contains-errors = Dokumen ini bakasalahan!

diagnostic-heading-error = Kasalahan
diagnostic-heading-warning = Paringatan
diagnostic-heading-information = Info
diagnostic-heading-hint = Patunjuk

accessibility-heading-level-1 = Palanggaran aksesibilitas WCAG AA
accessibility-heading-level-2 = Paringatan aksesibilitas

something-went-wrong = Ada nang salah.

renderer-load-failed = sabuting perender kada kawa dimuat. Muat ulang halaman ni.

core-start-failed = Dokumen ini kada kawa dijalanakan. Muat ulang halaman ni.

core-start-failed-busy = Dokumen ini kada kawa dijalanakan. Ada babarapa dokumen nang bamula sabarataan, nang kawa jadi labih lawas di alat nang lambat. Muat ulang halaman ni mungkin manulungi imbah dokumen nang lain tuntung.

core-start-failed-retry = Dokumen ini kada kawa dijalanakan.

core-start-failed-busy-retry = Dokumen ini kada kawa dijalanakan. Ada babarapa dokumen nang bamula sabarataan, nang kawa jadi labih lawas di alat nang lambat.

core-start-retry = Cuba pulang

saved-state-unavailable = Gawian pian nang tasimpan kada kawa dimuat.
