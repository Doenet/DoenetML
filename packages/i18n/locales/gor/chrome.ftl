# Gorontalo (Bahasa Hulontalo) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This catalog is a Gorontalo frame around declared Indonesian loans, and it
# says so first rather than last.** Gorontalo is spoken in Gorontalo province
# on the northern peninsula of Sulawesi; it has published lexical material, but
# less of it than Toba Batak or Nias, and a seed can reach very little of it.
# What is Gorontalo here is the **frame** — the negator «diila», the modal
# «mowali», the nominalizing relator «u», the existential «woluwo», the
# conjunctions «wawu», «meyalo», «wonu» and «sababu», the prepositions «to» and
# «lonto», the genitive «lo», the verb «mohutu» and the causative prefix
# «mopo-». Almost every content noun is an Indonesian loan, written as
# Indonesian writes it. A speaker should expect to rewrite the sentences rather
# than to correct words inside them.
#
# The one place native content vocabulary is attempted is the colour table in
# `content.ftl`, and that header says exactly which five words are attempted
# and how confident the seed is in them.
#
# **Orthography: the Latin practice in current use**, the alphabet Gorontalo is
# written with in local publishing and in the province's schools: `a b d e f g
# h i j k l m n o p r s t u w y` plus the digraph `ng` and the apostrophe `'`
# for the glottal stop. No diacritics. Gorontalo has no competing script, so
# the choice a corrector might disagree with is not the alphabet but the
# spelling of the glottal stop and of the long vowels, which local practice
# writes inconsistently; this catalog writes the glottal stop only where a word
# would otherwise be ambiguous, and does not double a long vowel. A corrector
# who wants either convention applied throughout should apply it to **all four
# files at once**.
#
# **The technical register is Indonesian, and it is declared as a loan
# register rather than dressed up.** Gorontalo speakers are schooled in
# Indonesian; the words for a line, a circle, an attribute, a version and a
# document are the Indonesian ones in a Gorontalo classroom. This catalog uses
# them as they stand — «garis», «lingkaran», «atribut», «versi», «dokumen»,
# «komponen», «nilai», «baris», «kolom» — and does not respell them into an
# invented Gorontalo phonology. Writing «atributu» or «garisi» would look like
# a loan Gorontalo had actually made, and the seed does not know that it has.
#
# **What this catalog does not know.** Gorontalo distinguishes inclusive from
# exclusive first person and marks its verbs for a set of aspectual and modal
# prefixes the seed cannot use reliably; every verb here is written in a plain
# unmarked form, which will read as flat rather than as wrong. It also does not
# know the polite register a button ought to be in.
#
# Gorontalo has a single plural category — a noun after a numeral is
# unmarked — so `attempts-remaining` and `answer-show-responses` collapse to a
# single `*[other]` branch. The `[0]` branch stays: Fluent matches a numeric
# literal against the number itself, before any plural rule.


## Answer submission

answer-checking = Hemapareksa...
answer-submitting = Hemodelo...

answer-checking-status = Hemapareksa jawaban
answer-submitting-status = Hemodelo jawaban

answer-correct = Banari
answer-incorrect = Diila banari

answer-response-saved = Jawaban ma tuwoto

answer-percent-credit = Nilai { $percent }%
answer-percent-correct = { $percent }% banari
answer-percent-short = { $percent } %

max-credit-available = Nilai u palingu daata woluwo: { $percent }%

attempts-remaining =
    { $count ->
        [0] diila woluwo poli usaha
       *[other] { $count } usaha u ontonga poli
    }

validation-correct = (Banari)
validation-incorrect = (Diila banari)
validation-partially-correct = (Banari ngointa)

answer-show-responses = Popobiloheyi { $count } jawaban ode { $answerId }


## Disclosure panels

feedback-heading = Tanggapan

collapsible-click-to-open = (klik u mohuo)
collapsible-click-to-close = (klik u molautu)

collapsible-initializing = Hemopo'olopu...

footnote-show = Popobiloheyi catatan to walungo
footnote-hide = Potuowa catatan to walungo

description-more-information = keterangan poli


## Controls

slider-previous = U lomayi
slider-next = U ma monao

keyboard-open = Huo papan ketik
keyboard-close = Lautu papan ketik

choice-input-remove-choice = Luluta { $choice }

matrix-remove-row = Luluta baris
matrix-add-row = Tambahi baris
matrix-remove-column = Luluta kolom
matrix-add-column = Tambahi kolom

subset-add-remove-points = Tambahi/Luluta titik
subset-toggle-points-intervals = Bulita titik wawu selang
subset-move-points = Deloa titik
subset-clear = Bersihi

orbital-add-row = Tambahi baris
orbital-remove-row = Luluta baris
orbital-add-box = Tambahi kotak
orbital-remove-box = Luluta kotak
orbital-add-up-arrow = Tambahi panah ode yitato
orbital-add-down-arrow = Tambahi panah ode walungo
orbital-remove-arrow = Luluta panah

orbital-row-label = Label ode baris { $row }

pretzel-answer = Jawaban



## Math input

math-input-preview-region = pratinjau lo ekspresi matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ekspresi u diila banari:


## Document status

viewer-initializing = Hemopo'olopu...


## Errors

error-heading = Ututala

error-found-at =
    { $span ->
        [line] Iloontonga to baris { $startLine }.
       *[lines] Iloontonga to baris { $startLine }–{ $endLine }.
    }

document-contains-errors = Dokumen botie o ututala!

diagnostic-heading-error = Ututala
diagnostic-heading-warning = Poti'ingoti
diagnostic-heading-information = Info
diagnostic-heading-hint = Petunjuk

accessibility-heading-level-1 = Pelanggaran aksesibilitas WCAG AA
accessibility-heading-level-2 = Poti'ingoti aksesibilitas

something-went-wrong = Woluwo u tala.

renderer-load-failed = ngotalu perender diila mowali dimuat. Poluli mohuo halaman botie.

core-start-failed = Dokumen botie diila mowali pomulaalo. Poluli mohuo halaman botie.

core-start-failed-busy = Dokumen botie diila mowali pomulaalo. Daata dokumen lomula to wakutu tuwawu, wawu uito mowali lebe hiheo to alat u molambatu. Poluli mohuo halaman botie wonu dokumen wuwewo ma yilapato.

core-start-failed-retry = Dokumen botie diila mowali pomulaalo.

core-start-failed-busy-retry = Dokumen botie diila mowali pomulaalo. Daata dokumen lomula to wakutu tuwawu, wawu uito mowali lebe hiheo to alat u molambatu.

core-start-retry = Poluli

saved-state-unavailable = Karajamu u tuwoto diila mowali biluohu.
