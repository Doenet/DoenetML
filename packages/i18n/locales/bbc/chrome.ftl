# Toba Batak (Hata Batak Toba) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, and that is an argument rather than an oversight.** Toba
# Batak has a script of its own, Surat Batak, and it is taught, printed and
# carved; Unicode encodes it at U+1BC0–U+1BFF. It is not what Toba Batak is
# *written* in. Every newspaper, hymnal, dictionary and schoolbook in the
# language since the nineteenth century is in the Latin alphabet, and a reader
# who meets Toba Batak prose meets it in Latin. A seed written in Surat Batak
# would be a display of the script rather than a catalog anybody reads, and it
# would also have to decide a dozen things — how to write the loanwords, where
# to put the pangolat — that no current practice settles. So: **Latin**, in the
# conventional spelling of the Batak Bible and of Warneck's dictionary. A
# corrector who wants Surat Batak must convert **all four files at once** and
# must never mix two scripts inside one catalog.
#
# The letters used are `a b d e g h i j k l m n o p r s t u` plus the digraph
# `ng`, and, in loanwords only, `c f v w y z`. `e` is written for both /e/ and
# /ə/, as the standard spelling does; this catalog does not mark the schwa.
#
# **The technical register is Indonesian, and it is declared as such.** Batak
# speakers are schooled in Indonesian, and the words for a line, a circle, a
# polygon, an attribute and a version are the Indonesian ones in a Toba Batak
# classroom as much as in an Indonesian one. This catalog uses them —
# `garis`, `lingkaran`, `poligon`, `atribut`, `versi`, `dokumen`, `format`,
# `label`, `kolom`, `baris` — rather than coining Batak equivalents that no
# teacher would recognize. What is Toba Batak here is everything around them:
# the verbs, the negator `ndang`, the modal `boi`, the attributive linker `na`,
# the conjunctions `dohot`, `alai`, `jala`, `manang`, `molo` and `ala`, and the
# derivational prefixes `mar-`, `mang-`/`mam-`, `pa-` and `di-`.
#
# **Words this catalog uses that are Toba Batak and not Indonesian**, so that a
# reviewer can see the seam: «sintong» (correct), «sala» (wrong), «hasalaan»
# (error), «alus» (answer), «pasahat» (submit, hand over), «pareso» (check),
# «patuduhon» (show), «tabunihon» (hide), «pahobas» (make ready), «buhai»
# (open), «sesa» (erase), «pahehe» (start up, raise), «jumpang» (found),
# «balosan» (reply — used here for *feedback*, in preference to Indonesian
# «umpan balik», which reads as a translation rather than as speech),
# «sipaingot» (warning), «panuturi» (advice), «ginjang» (up), «toru» (down),
# «ulahi» (do again).
#
# **What this catalog does not know.** Toba Batak has a rich set of politeness
# and register distinctions, and a viewer's buttons are exactly the place where
# getting one wrong is noticeable. The seed writes plain unmarked forms
# throughout and makes no attempt at the deferential register; a speaker should
# expect to adjust the imperatives. It also does not know whether «hasalaan» or
# a phrase with «sala» reads better as a heading, and has picked one.
#
# Toba Batak has a single plural category — a noun after a numeral is
# unmarked — so `attempts-remaining` and `answer-show-responses` collapse to a
# single `*[other]` branch. The `[0]` branch stays: Fluent matches a numeric
# literal against the number itself, before any plural rule.


## Answer submission

answer-checking = Dipareso...
answer-submitting = Dipasahat...

answer-checking-status = Dipareso alus i
answer-submitting-status = Dipasahat alus i

answer-correct = Sintong
answer-incorrect = Sala

answer-response-saved = Nunga tarsimpan alus i

answer-percent-credit = Nilai { $percent }%
answer-percent-correct = { $percent }% sintong
answer-percent-short = { $percent } %

max-credit-available = Nilai na gumodang na boi dapot: { $percent }%

attempts-remaining =
    { $count ->
        [0] ndang adong be usaha na tading
       *[other] { $count } usaha na tading
    }

validation-correct = (Sintong)
validation-incorrect = (Sala)
validation-partially-correct = (Sintong sabagian)

answer-show-responses = Patuduhon { $count } alus tu { $answerId }


## Disclosure panels

feedback-heading = Balosan

collapsible-click-to-open = (klik laho mambuhai)
collapsible-click-to-close = (klik laho manutup)

collapsible-initializing = Dipahobas...

footnote-show = Patuduhon catatan di toru
footnote-hide = Tabunihon catatan di toru

description-more-information = keterangan tamba


## Controls

slider-previous = Na jolo
slider-next = Na pudi

keyboard-open = Buhai papan ketik
keyboard-close = Tutup papan ketik

choice-input-remove-choice = Buang { $choice }

matrix-remove-row = Buang baris
matrix-add-row = Tamba baris
matrix-remove-column = Buang kolom
matrix-add-column = Tamba kolom

subset-add-remove-points = Tamba/Buang titik
subset-toggle-points-intervals = Gantihon titik dohot selang
subset-move-points = Pindahon titik
subset-clear = Sesa

orbital-add-row = Tamba baris
orbital-remove-row = Buang baris
orbital-add-box = Tamba kotak
orbital-remove-box = Buang kotak
orbital-add-up-arrow = Tamba panah tu ginjang
orbital-add-down-arrow = Tamba panah tu toru
orbital-remove-arrow = Buang panah

orbital-row-label = Label tu baris { $row }

pretzel-answer = Alus



## Math input

math-input-preview-region = pratinjau ni ekspresi matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ekspresi na sala:


## Document status

viewer-initializing = Dipahobas...


## Errors

error-heading = Hasalaan

error-found-at =
    { $span ->
        [line] Jumpang di baris { $startLine }.
       *[lines] Jumpang di baris { $startLine }–{ $endLine }.
    }

document-contains-errors = Adong hasalaan di bagasan dokumen on!

diagnostic-heading-error = Hasalaan
diagnostic-heading-warning = Sipaingot
diagnostic-heading-information = Info
diagnostic-heading-hint = Panuturi

accessibility-heading-level-1 = Pelanggaran aksesibilitas WCAG AA
accessibility-heading-level-2 = Sipaingot aksesibilitas

something-went-wrong = Adong na sala.

renderer-load-failed = sada perender ndang boi dimuat. Ulahi ma mamuka halaman on.

core-start-failed = Ndang boi dipahehe dokumen on. Ulahi ma mamuka halaman on.

core-start-failed-busy = Ndang boi dipahehe dokumen on. Torop dokumen na pungka rap tingki, jala i boi lam leleng di alat na lambat. Ulahi mamuka halaman on molo nunga sidung dokumen na asing i.

core-start-failed-retry = Ndang boi dipahehe dokumen on.

core-start-failed-busy-retry = Ndang boi dipahehe dokumen on. Torop dokumen na pungka rap tingki, jala i boi lam leleng di alat na lambat.

core-start-retry = Ulahi

saved-state-unavailable = Ndang boi dibuat ulaonmu na tarsimpan.
