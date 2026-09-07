# Central Dusun / Kadazandusun viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Kadazandusun** (Boros Dusun), the Dusunic language of the interior and
# west coast of Sabah, Malaysia.
#
# **WHICH VARIETY.** `dtp` is Central Dusun, and this catalog is written in
# the **standardised Kadazandusun taught in Sabah's schools** — the written
# standard built on **Bundu-Liwan** Dusun and used in the state's
# Kadazandusun-language curriculum and dictionaries. `dtp` is one member of a
# cluster: **Coastal Kadazan is `kzj`**, **Labuk-Kinabatangan Kadazan is
# `dtb`** and **Rungus is `drg`**, and a reader of any of the three will find
# words here that are not theirs. «opurak» for white is the clearest of them —
# Coastal Kadazan says «oputi'» — and such a reader should expect to respell
# rather than to find their own variety served. That is the cost of one tag
# per catalog, not an oversight.
#
# `kzj` alone arrives here without anything in this repository arranging it:
# ICU canonicalizes the tag onto `dtp`, so a Coastal Kadazan request is served
# this file. `dtb` and `drg` fall to English, because `dtp` is not an ISO
# 639-3 macrolanguage and there is no published membership to fold them on.
#
# ORTHOGRAPHY. The standard Kadazandusun spelling: `v` is a letter of the
# alphabet and not a stand-in for `w` («vagu», «avasi»), the glottal stop is
# written with an apostrophe («amu'»), and `ng` is one letter. A corrector who
# prefers an older mission spelling should convert **all four files at once**.
#
# **THIS IS THE THINNEST CATALOG OF ITS BATCH, AND IT SAYS SO FIRST RATHER
# THAN LAST.** What is Kadazandusun here is the **frame**: the function words,
# the negators, the existentials, the colour terms and a short list of nouns.
# Most of the verbs and nearly all of the technical vocabulary are **declared
# Malay loans, written in Malay spelling and not adapted**. A Kadazandusun
# pupil in Sabah is schooled in Malay and meets these ideas in Malay, so a
# loan is what they actually use; what this seed refuses to do is invent a
# Kadazandusun word by hanging a Kadazandusun prefix on a Malay root, which
# would look like the language and be nothing of the sort. A speaker should
# expect to **rewrite sentences** here rather than to correct words inside
# them.
#
# THE KADAZANDUSUN A REVIEWER CAN CHECK IN A SECOND:
#
#   - **«waro»** for "there is" and **«aiso»** for "there is none" — the pair
#     this file leans on hardest;
#   - **«amu'»** for "not", **«om»** for "and", **«toi»** for "or",
#     **«nga»** for "but", **«nung»** for "if", **«montok»** for "for",
#     **«id»** for "at, in", **«mantad»** for "from", **«obuli»** for "can";
#   - **«diti»** "this", **«dilo'»** "that", **«nu»** "your", **«nogi»**
#     "still, more", **«vagu»** "again, new";
#   - the nouns it does have: «simbar» (answer), «ngaran» (name), «otopot»
#     (correct, true), «avasi» (good), «koilaan» (knowledge).
#
# **WHAT THIS CATALOG DOES NOT KNOW.** It cannot write Kadazandusun's verbal
# aspect, so the two progressive strings — `answer-checking` and
# `answer-submitting` — are written as a **bare verb with an ellipsis**
# instead of "is being checked". That is a hole, not a style, and it is the
# first thing to fix. It also has no confident word for "feedback", "hide" or
# "renderer", and writes the Malay «Maklum Balas», «Sorok» and the English
# `renderer` for the three.
#
# PLURALS. `Intl.PluralRules` has no data for `dtp`, so a `[one]` branch would
# be selected by the runtime's default locale rather than by Kadazandusun —
# and Kadazandusun would not want one, since a noun after a numeral is
# unmarked. Every count select is collapsed to a single `*[other]`. An
# explicit `[0]` is matched against the number itself rather than against a
# plural category, so it stays.


## Answer submission

answer-checking = Periksa…
answer-submitting = Hantar…
answer-checking-status = Periksa simbar
answer-submitting-status = Hantar simbar
answer-correct = Otopot
answer-incorrect = Amu' otopot
answer-response-saved = Simbar disimpan
answer-percent-credit = { $percent }% markah
answer-percent-correct = { $percent }% otopot
answer-percent-short = { $percent } %
max-credit-available = Markah paling tinggi dot obuli: { $percent }%
attempts-remaining =
    { $count ->
        [0] aiso no peluang
       *[other] { $count } peluang nogi
    }
validation-correct = (Otopot)
validation-incorrect = (Amu' otopot)
validation-partially-correct = (Otopot sebahagian)
answer-show-responses =
    { $count ->
       *[other] Tunjuk { $count } simbar montok { $answerId }
    }


## Disclosure panels

feedback-heading = Maklum Balas
collapsible-click-to-open = (tekan montok buka)
collapsible-click-to-close = (tekan montok tutup)
collapsible-initializing = Sedia…
footnote-show = Tunjuk nota kaki
footnote-hide = Sorok nota kaki
description-more-information = keterangan tambahan


## Controls

slider-previous = Sebelum
slider-next = Seterusnya
keyboard-open = Buka Papan Kekunci
keyboard-close = Tutup Papan Kekunci
choice-input-remove-choice = Buang { $choice }
matrix-remove-row = Buang baris
matrix-add-row = Tambah baris
matrix-remove-column = Buang lajur
matrix-add-column = Tambah lajur
subset-add-remove-points = Tambah/Buang titik
subset-toggle-points-intervals = Tukar antara titik om selang
subset-move-points = Alih Titik
subset-clear = Kosongkan
orbital-add-row = Tambah Baris
orbital-remove-row = Buang Baris
orbital-add-box = Tambah Kotak
orbital-remove-box = Buang Kotak
orbital-add-up-arrow = Tambah Anak Panah Ke Atas
orbital-add-down-arrow = Tambah Anak Panah Ke Bawah
orbital-remove-arrow = Buang Anak Panah
orbital-row-label = Label montok baris { $row }
pretzel-answer = Simbar


## Math input

math-input-preview-region = pratonton ungkapan matematik
math-input-preview = Pratonton
math-input-invalid-expression = Ungkapan amu' otopot:


## Document status

viewer-initializing = Sedia…


## Errors

error-heading = Ralat
error-found-at =
    { $span ->
        [line] Nokito id baris { $startLine }.
       *[lines] Nokito id baris { $startLine }–{ $endLine }.
    }
document-contains-errors = Waro ralat id dokumen diti!
diagnostic-heading-error = Ralat
diagnostic-heading-warning = Amaran
diagnostic-heading-information = Maklumat
diagnostic-heading-hint = Petunjuk
accessibility-heading-level-1 = Pelanggaran akses WCAG AA
accessibility-heading-level-2 = Amaran akses
something-went-wrong = Waro masalah nokojadi.
renderer-load-failed = iso renderer amu' obuli dimuat. Muat semula halaman diti.
core-start-failed = Dokumen diti amu' obuli dimulakan. Muat semula halaman diti.
core-start-failed-busy = Dokumen diti amu' obuli dimulakan. Beberapa dokumen dimulakan serentak, om diti obuli mengambil masa lebih lama id peranti dot perlahan. Muat semula halaman diti obuli menolong nung dokumen lain siap.
core-start-failed-retry = Dokumen diti amu' obuli dimulakan.
core-start-failed-busy-retry = Dokumen diti amu' obuli dimulakan. Beberapa dokumen dimulakan serentak, om diti obuli mengambil masa lebih lama id peranti dot perlahan.
core-start-retry = Cuba Vagu
saved-state-unavailable = Kerja nu dot disimpan amu' obuli dimuat.
