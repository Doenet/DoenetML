# Madurese viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin orthography of Madurese publishing, with the vowel marks
# the language spells — «konèng», «jhâwâban», «bendher».
#
# **Speech level.** Madurese chooses a register for every sentence, and a file
# with two registers in it is wrong in both. This catalog is written throughout
# in **enjâ'-iyâ**, the plain everyday level, which is what Madurese writing
# addressed to a general reader uses; èngghi-enten and èngghi-bunten are derived
# from it rather than the other way round. That is the decision `locales/jv`,
# `locales/su` and `locales/ban` already record. A deployment that wants a
# higher level supplies its own catalog as `localeResources`; correcting this
# file sentence by sentence toward one is what would leave the locale in two
# registers at once.
#
# Madurese marks no number on the noun, so a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped. A `[0]` branch stays wherever English has one.


## Answer submission

answer-checking = Mareksa…
answer-submitting = Ngèrèm…
answer-checking-status = Mareksa jhâwâban
answer-submitting-status = Ngèrèm jhâwâban
answer-correct = Bendher
answer-incorrect = Ta' bendher
answer-response-saved = Jhâwâbanna la èsimpen
answer-percent-credit = { $percent }% kredit
answer-percent-correct = { $percent }% bendher
answer-percent-short = { $percent } %
max-credit-available = Kredit se paleng bânnya' se ekaollè: { $percent }%
# No select: «coba» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] tadâ' pole coba se karè
       *[other] karè { $count } coba
    }
validation-correct = (Bendher)
validation-incorrect = (Ta' bendher)
validation-partially-correct = (Bendher sabâgiyân)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Toduwagi { $count } jhâwâban kaangguy { $answerId }

## Disclosure panels

feedback-heading = Komentar
collapsible-click-to-open = (klik sopaja abukka')
collapsible-click-to-close = (klik sopaja atotop)
collapsible-initializing = Molaè…
footnote-show = Toduwagi footnote
footnote-hide = Nyèmponnè footnote
description-more-information = katerrangan laèn

## Controls

slider-previous = Sabellunna
slider-next = Salanjudde
keyboard-open = Bukka' papan tuts
keyboard-close = Totop papan tuts
choice-input-remove-choice = Buwang { $choice }
matrix-remove-row = Buwang barisa
matrix-add-row = Tambâ baris
matrix-remove-column = Buwang kolomma
matrix-add-column = Tambâ kolom
subset-add-remove-points = Nambâ/Mowang titik
subset-toggle-points-intervals = Ngoba titik ban interval
subset-move-points = Pindâ titikka
subset-clear = Berseagi
orbital-add-row = Tambâ baris
orbital-remove-row = Buwang barisa
orbital-add-box = Tambâ kotak
orbital-remove-box = Buwang kotakka
orbital-add-up-arrow = Tambâ panah ka attas
orbital-add-down-arrow = Tambâ panah ka bâbâ
orbital-remove-arrow = Buwang panahha
orbital-row-label = Label kaangguy baris { $row }
pretzel-answer = Jhâwâban

## Math input

math-input-preview-region = pratinjau ungkapan matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ungkapan se ta' sah:

## Document status

viewer-initializing = Molaè…

## Errors

error-heading = Kasalaan
error-found-at =
    { $span ->
        [line] Etemmo e baris { $startLine }.
       *[lines] Etemmo e baris { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokumen rèya badâ kasalaanna!
diagnostic-heading-error = Kasalaan
diagnostic-heading-warning = Parèngèdan
diagnostic-heading-information = Katerrangan
diagnostic-heading-hint = Petodu
accessibility-heading-level-1 = Palanggharân aksesibilitas WCAG AA
accessibility-heading-level-2 = Parèngèdan parkara aksesibilitas
something-went-wrong = Badâ se sala.
renderer-load-failed = badâ renderer se ta' bisa emowat. Nyo'on mowat pole kacana.
core-start-failed = Panèngalan dokumen ta' bisa emolaè. Nyo'on mowat pole kacana.
