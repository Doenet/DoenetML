# Iban viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Iban** (Jaku Iban), the Malayic language of Sarawak and of the upper Kapuas
# in West Kalimantan. It is close to Malay and this catalog is written by
# somebody who can read Malay, which is the whole of its risk: see below.
#
# ORTHOGRAPHY. The standard Sarawak spelling used in Iban schooling, in the
# Iban press and in the Bup Kudus. Its two visible breaks with Malay are kept
# throughout and are not typos: **`ch`** where Malay writes `c` («chukup»,
# «chunto»), and **`nya`/`ny`** as in Malay. Verbal and nominal prefixes are
# written Iban rather than Malay: **`be-`** for Malay `ber-` («besisi»,
# «bejalai»), **`te-`** for Malay `ter-` («tebalik»), **`pe-`/`peN-`** for
# Malay `per-`/`peN-` («penerang», «pengawa», «penyalah»). A corrector who
# prefers the older mission spellings should convert **all four files at
# once** and should not leave one file in one system.
#
# **THE RISK THIS FILE IS WRITTEN AROUND.** Iban's technical register really
# is Malay — an Iban speaker is schooled in Malay and meets «poligon»,
# «fungsi» and «vektor» in a Malay textbook — so the honest catalog uses those
# words and says it is using them. What must not happen is the other thing:
# Malay sentences with a few Iban words dropped in. So the *grammar* of this
# file is Iban and is checkable in a second:
#
#   - the three negators are kept apart — **«enda»** before a verb, **«ukai»**
#     before a noun or an identification, **«nadai»** for "there is none";
#   - **«bisi»** for "there is", **«udah»** for the perfect, **«benung»** for
#     the progressive, **«agi»** for "still, any more";
#   - **«enggau»** for "and/with", **«tauka»** for "or", **«ba»** for "at",
#     **«ngagai»** for "to", **«ti»** as the relativizer, **«nuan»** for "you";
#   - everyday words that are Iban and not Malay: «utai», «mayuh», «besai»,
#     «pemadu», «bukai», «kutak», «lambar», «jaku», «tulung», «lubah», «tembu».
#
# A reviewer who finds a Malay function word in here — «yang», «ada»,
# «tidak», «dengan», «atau» — has found a defect, and it is the defect this
# seed is most likely to have made.
#
# DECLARED LOANS. `WCAG`, `DoenetML`, `renderer`, `statistik`, `matematik`,
# `markah`, `label`, `baris`, `lajur`, `papan kekunci`, `komponen`, `akses`
# and `amaran` are written as they stand. The first four are English; the rest
# are the Malay school words, kept because that is what an Iban reader has met
# them as, and named here rather than replaced with a coinage.
#
# WHAT THIS CATALOG DOES NOT KNOW. It has no Iban word for "to hide", so
# `footnote-hide` says "close" («Tutup») instead — the word that can be
# written without guessing. It has no Iban word for "renderer" and keeps the
# English. Both are the first places to look.
#
# PLURALS. `Intl.PluralRules` has no data for `iba`, so a `[one]` branch would
# be selected by whatever the runtime's default locale is rather than by Iban
# — and Iban would not want one anyway, since a noun after a numeral is not
# marked («dua kutak», not «dua kutak-kutak»). Every count select is collapsed
# to a single `*[other]`. An explicit `[0]` is matched against the number
# itself rather than against a plural category, so it stays.


## Answer submission

answer-checking = Benung nguji…
answer-submitting = Benung ngirum…
answer-checking-status = Benung nguji saut
answer-submitting-status = Benung ngirum saut
answer-correct = Amat
answer-incorrect = Salah
answer-response-saved = Saut udah disimpan
answer-percent-credit = { $percent }% markah
answer-percent-correct = { $percent }% amat
answer-percent-short = { $percent } %
max-credit-available = Markah pemadu besai ti ulih diambi: { $percent }%
attempts-remaining =
    { $count ->
        [0] nadai peluang agi
       *[other] { $count } peluang agi
    }
validation-correct = (Amat)
validation-incorrect = (Salah)
validation-partially-correct = (Amat sekeda)
answer-show-responses =
    { $count ->
       *[other] Ayanka { $count } saut ngagai { $answerId }
    }


## Disclosure panels

feedback-heading = Jaku Balas
collapsible-click-to-open = (tekan kena muka)
collapsible-click-to-close = (tekan kena nutup)
collapsible-initializing = Benung nyedia…
footnote-show = Ayanka nota kaki
footnote-hide = Tutup nota kaki
description-more-information = penerang tambah


## Controls

slider-previous = Ka Belakang
slider-next = Ka Mua
keyboard-open = Muka Papan Kekunci
keyboard-close = Tutup Papan Kekunci
choice-input-remove-choice = Buai { $choice }
matrix-remove-row = Buai baris
matrix-add-row = Tambah baris
matrix-remove-column = Buai lajur
matrix-add-column = Tambah lajur
subset-add-remove-points = Tambah/Buai titik
subset-toggle-points-intervals = Tukar entara titik enggau selang
subset-move-points = Pindahka Titik
subset-clear = Kosongka
orbital-add-row = Tambah Baris
orbital-remove-row = Buai Baris
orbital-add-box = Tambah Kutak
orbital-remove-box = Buai Kutak
orbital-add-up-arrow = Tambah Anak Panah Ka Atas
orbital-add-down-arrow = Tambah Anak Panah Ka Baruh
orbital-remove-arrow = Buai Anak Panah
orbital-row-label = Nama ke baris { $row }
pretzel-answer = Saut


## Math input

math-input-preview-region = peda dulu ungkapan matematik
math-input-preview = Peda Dulu
math-input-invalid-expression = Ungkapan enda betul:


## Document status

viewer-initializing = Benung nyedia…


## Errors

error-heading = Penyalah
error-found-at =
    { $span ->
        [line] Ditemu ba baris { $startLine }.
       *[lines] Ditemu ba baris { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokumen tu bisi penyalah!
diagnostic-heading-error = Penyalah
diagnostic-heading-warning = Amaran
diagnostic-heading-information = Penerang
diagnostic-heading-hint = Tunjuk Jalai
accessibility-heading-level-1 = Pelanggar akses WCAG AA
accessibility-heading-level-2 = Amaran pasal akses
something-went-wrong = Bisi utai ti salah nyadi.
renderer-load-failed = siti renderer enda ulih dimuat. Tulung muat baru lambar tu.
core-start-failed = Dokumen tu enda ulih dimulaka. Tulung muat baru lambar tu.
core-start-failed-busy = Dokumen tu enda ulih dimulaka. Mayuh dokumen benung dimulaka sama-sama, lalu tu majak lama agi ba alat ti lubah. Muat baru lambar tu ulih nulung lebuh dokumen bukai udah tembu.
core-start-failed-retry = Dokumen tu enda ulih dimulaka.
core-start-failed-busy-retry = Dokumen tu enda ulih dimulaka. Mayuh dokumen benung dimulaka sama-sama, lalu tu majak lama agi ba alat ti lubah.
core-start-retry = Uji Baru
saved-state-unavailable = Pengawa nuan ti udah disimpan enda ulih dimuat.
