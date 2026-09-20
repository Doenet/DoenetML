# Balinese viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** orthography Balinese schooling and publishing use, so
# a reader arriving under `ban-Bali` — the Balinese script — reaches this and
# gets Latin. That is the asymmetry `pa`, `sr`, `jv` and `su` already have, and
# the answer to it is a second catalog beside this one rather than a rename of
# it.
#
# **Speech level.** Balinese chooses a register for every sentence, and a file
# with two registers in it is wrong in both. This catalog is written throughout
# in **basa andap**, the unmarked everyday level, which is what Balinese writing
# addressed to a general reader uses and what the alus levels would be derived
# from. That is the decision `locales/jv` and `locales/su` already record for
# ngoko and loma. A deployment that wants basa alus supplies its own catalog as
# `localeResources`; correcting this file sentence by sentence toward it is what
# would leave the locale in two registers at once.
#
# Balinese marks no number on the noun — a count in front of it does that work —
# so a `{ $count -> … }` whose two English branches differ only in the noun
# renders one string here and the select is dropped. A `[0]` branch stays
# wherever English has one.


## Answer submission

answer-checking = Ngecek…
answer-submitting = Ngirim…
answer-checking-status = Ngecek pasaut
answer-submitting-status = Ngirim pasaut
answer-correct = Beneh
answer-incorrect = Pelih
answer-response-saved = Pasautne suba kasimpen
answer-percent-credit = { $percent }% kredit
answer-percent-correct = { $percent }% beneh
answer-percent-short = { $percent } %
max-credit-available = Kredit paling gede ane bakat: { $percent }%
# No select: «kesempatan» is the same word for one and for many. The `[0]`
# branch stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] tusing ada kesempatan ane enu
       *[other] enu { $count } kesempatan
    }
validation-correct = (Beneh)
validation-incorrect = (Pelih)
validation-partially-correct = (Beneh abagian)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Edengang { $count } pasaut anggon { $answerId }

## Disclosure panels

feedback-heading = Komentar
collapsible-click-to-open = (klik apang mabukak)
collapsible-click-to-close = (klik apang matutup)
collapsible-initializing = Ngawitin…
footnote-show = Edengang footnote
footnote-hide = Engkebang footnote
description-more-information = informasi ane lenan

## Controls

slider-previous = Sadurunge
slider-next = Salanturne
keyboard-open = Ampakang papan tuts
keyboard-close = Tekepang papan tuts
choice-input-remove-choice = Kaadang { $choice }
matrix-remove-row = Kaadang barisne
matrix-add-row = Imbuhin baris
matrix-remove-column = Kaadang kolomne
matrix-add-column = Imbuhin kolom
subset-add-remove-points = Ngimbuhin/Ngaadang titik
subset-toggle-points-intervals = Nyilurin titik lan interval
subset-move-points = Genahang titikne
subset-clear = Kedasin
orbital-add-row = Imbuhin baris
orbital-remove-row = Kaadang barisne
orbital-add-box = Imbuhin kotak
orbital-remove-box = Kaadang kotakne
orbital-add-up-arrow = Imbuhin panah menek
orbital-add-down-arrow = Imbuhin panah tuun
orbital-remove-arrow = Kaadang panahne
orbital-row-label = Label anggon baris { $row }
pretzel-answer = Pasaut

## Math input

math-input-preview-region = pratinjau ekspresi matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ekspresi ane tusing sah:

## Document status

viewer-initializing = Ngawitin…

## Errors

error-heading = Kaiwangan
error-found-at =
    { $span ->
        [line] Katemu di baris { $startLine }.
       *[lines] Katemu di baris { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokumen ene ngelah kaiwangan!
diagnostic-heading-error = Kaiwangan
diagnostic-heading-warning = Pinget
diagnostic-heading-information = Informasi
diagnostic-heading-hint = Tunjuk
accessibility-heading-level-1 = Pelanggaran aksesibilitas WCAG AA
accessibility-heading-level-2 = Pinget indik aksesibilitas
something-went-wrong = Ada ane pelih.
renderer-load-failed = ada renderer ane tusing nyidang kaload. Ledang muat ulang kacane.
core-start-failed = Panyingakan dokumene tusing nyidang kawitin. Ledang muat ulang kacane.
