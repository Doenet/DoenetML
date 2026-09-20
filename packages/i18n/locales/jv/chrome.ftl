# Javanese viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# SPEECH LEVEL. Javanese chooses a register for every sentence, and a catalog
# cannot leave the choice open: this one is written in **ngoko**, the plain
# level, throughout — all four namespaces of it. Ngoko is what Javanese
# writing addressed to a general reader uses, and it is what a krama catalog
# would be derived *from* rather than the other way round. A deployment that
# wants krama supplies its own catalog as `localeResources`, which wins over
# this one; it is not a correction to make here, because a file with both
# levels in it is wrong in either register.
#
# Javanese has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero. A noun is not marked for number, so
# «{ $count } kesempatan» is both "1 attempt" and "5 attempts".
#
# The Latin orthography is the one Javanese schooling, publishing and CLDR all
# use. A reader arriving under `jv-Java` — the Javanese script — reaches this
# catalog and gets Latin; the answer to that is a second catalog beside this
# one rather than a rename of it.


## Answer submission

answer-checking = Mriksa...
answer-submitting = Ngirim...
answer-checking-status = Mriksa wangsulan
answer-submitting-status = Ngirim wangsulan
answer-correct = Bener
answer-incorrect = Salah
answer-response-saved = Wangsulan Disimpen
answer-percent-credit = Biji { $percent }%
answer-percent-correct = Bener { $percent }%
answer-percent-short = { $percent }%
max-credit-available = Biji paling dhuwur sing bisa diolèh: { $percent }%
attempts-remaining =
    { $count ->
        [0] ora ana kesempatan sing kèri
       *[other] kèri { $count } kesempatan
    }
validation-correct = (Bener)
validation-incorrect = (Salah)
validation-partially-correct = (Bener sabagéan)
answer-show-responses = Tampilaké { $count } wangsulan kanggo { $answerId }

## Disclosure panels

feedback-heading = Tanggapan
collapsible-click-to-open = (klik kanggo mbukak)
collapsible-click-to-close = (klik kanggo nutup)
collapsible-initializing = Miwiti...
footnote-show = Tampilaké cathetan sikil
footnote-hide = Ndhelikaké cathetan sikil
description-more-information = katrangan liyané

## Controls

slider-previous = Sadurungé
slider-next = Sabanjuré
keyboard-open = Bukak Papan Tuts
keyboard-close = Tutup Papan Tuts
choice-input-remove-choice = Busak { $choice }
matrix-remove-row = Busak larik
matrix-add-row = Tambah larik
matrix-remove-column = Busak kolom
matrix-add-column = Tambah kolom
subset-add-remove-points = Tambah/Busak titik
subset-toggle-points-intervals = Ganti titik lan interval
subset-move-points = Pindhah Titik
subset-clear = Resiki
orbital-add-row = Tambah Larik
orbital-remove-row = Busak Larik
orbital-add-box = Tambah Kothak
orbital-remove-box = Busak Kothak
orbital-add-up-arrow = Tambah Panah Munggah
orbital-add-down-arrow = Tambah Panah Mudhun
orbital-remove-arrow = Busak Panah
orbital-row-label = Label kanggo larik { $row }
pretzel-answer = Wangsulan

## Math input

math-input-preview-region = pratayang èkspresi matématika
math-input-preview = Pratayang
math-input-invalid-expression = Èkspresi ora bener:

## Document status

viewer-initializing = Miwiti...

## Errors

error-heading = Kaluputan
error-found-at =
    { $span ->
        [line] Ketemu ing larik { $startLine }.
       *[lines] Ketemu ing larik { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokumèn iki ngandhut kaluputan!
diagnostic-heading-error = Kaluputan
diagnostic-heading-warning = Pènget
diagnostic-heading-information = Info
diagnostic-heading-hint = Pituduh
accessibility-heading-level-1 = Pelanggaran Aksesibilitas WCAG AA
accessibility-heading-level-2 = Pènget aksesibilitas
something-went-wrong = Ana sing salah.
renderer-load-failed = ana perènder sing gagal dimuat. Muat ulanga kaca iki.
core-start-failed = Panampil dokumèn ora bisa diwiwiti. Muat ulanga kaca iki.
