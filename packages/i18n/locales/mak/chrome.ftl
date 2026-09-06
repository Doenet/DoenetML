# Makasar (Basa Mangkasara') viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, not Lontara.** Makasar has two historic scripts of its own,
# Lontara and the older Makasar script (Ukiri' Jangang-jangang), and a reviewer
# may reasonably have expected one of them. This catalog writes **Latin**,
# because Latin is what Makasar is written in today in print, in schoolbooks
# and online, and because Lontara does not write the final glottal stop, the
# geminates or the syllable-final nasal — the three things this language's
# spelling turns on. In Lontara «kebo'» and «kebo», «ca'di» and «cadi» would
# look the same, and a reviewer could not tell a correction from a typo.
# Converting to Lontara means converting **all four files at once**, and it is
# a conversion rather than a transliteration, because the distinctions the
# script drops would have to be restored by someone who knows the words.
#
# **The final glottal stop is written with the ASCII apostrophe `'`
# (U+0027)**, everywhere in all four files — «kebo'», «ca'di», «tena nia'»,
# «tanra». The typographic apostrophe U+2019 appears nowhere, so a search for
# `'` finds every one of them. This is the convention Makasar print uses and
# the one a reviewer can type without a special keyboard.
#
# **The technical register is Indonesian, and it is declared rather than
# disguised.** Makasar speakers are schooled in Indonesian, and the words for a
# component, an attribute, a matrix, a percentage or a keyboard are the
# Indonesian ones because those are the words the community uses. They are
# written here as Indonesian, not respelled into a Makasar shape the language
# does not give them.
#
# **What is Makasar here is the frame**, and it is used consistently: «tena»
# for *tidak* and «tena nia'» for *tidak ada*, «akkulle» for *bisa* (so
# *cannot* is «tena nakkulle»), «siagang» for *dengan* and *dan*, «yareka» for
# *atau*, «lanri» for *karena*, «punna» for *jika*, «mingka» for *tetapi*,
# «battu ri» for *dari*, «untu'» for *untuk*, «ri» for *di*, «ngaseng» for
# *semua*, «tunggala'» for *tiap*, «tenapa» for *belum*, «le'ba'» for *sudah*,
# «nigappa» for *ditemukan*, «pole» for *lagi*, «dudu» after an adjective for
# *terlalu*, «anne» and «anjo» for *ini* and *itu*, and «katte» as the polite
# second person.
#
# **This is not the Buginese catalog with different spellings.** `locales/bug`
# is the neighbouring language and the two are typologically alike, but the
# function words are different words and are kept apart deliberately: Buginese
# «de'», «wedding», «sibawa», «iyaré'ga», «nasaba», «rékko», «naé», «pole ri»,
# «maneng» against Makasar «tena», «akkulle», «siagang», «yareka», «lanri»,
# «punna», «mingka», «battu ri», «ngaseng». A message here written with a
# Buginese function word is a mistake, not a variant.
#
# **Counts.** CLDR has no plural data for `mak`, so `Intl.PluralRules` would
# resolve it against the runtime's own locale and any `[one]` branch would be
# selected by English's rules. The two counted messages here collapse to a
# single `*[other]`, keeping only `attempts-remaining`'s explicit `[0]`, which
# Fluent matches against the number itself. A Makasar noun is unmarked after a
# numeral anyway, so one form is correct.


## Answer submission — the check-work button and the status it reports.

answer-checking = Niparessa...
answer-submitting = Nikiring...

answer-checking-status = Paressa jawaban
answer-submitting-status = Kiring jawaban

answer-correct = Tojeng
answer-incorrect = Sala

answer-response-saved = Jawaban le'ba' niboli'

answer-percent-credit = Nilai { $percent }%
answer-percent-correct = { $percent }% tojeng
answer-percent-short = { $percent } %

max-credit-available = Nilai kaminang lompo akkullea nigappa: { $percent }%

attempts-remaining =
    { $count ->
        [0] tena nia' pole percobaan tassisa
       *[other] tassisa { $count } percobaan
    }

validation-correct = (Tojeng)
validation-incorrect = (Sala)
validation-partially-correct = (Sipa'gang tojeng)

answer-show-responses = Paccinikangi { $count } jawaban untu' { $answerId }


## Disclosure panels

feedback-heading = Pappiali balasa'

collapsible-click-to-open = (klik untu' sungke)
collapsible-click-to-close = (klik untu' tongko')

collapsible-initializing = Nipasadia...

footnote-show = Paccinikangi catatang rawa
footnote-hide = Cokkoi catatang rawa

description-more-information = katarangang la'biangngang


## Controls

slider-previous = Riolo
slider-next = Ribokoang

keyboard-open = Sungke papan katti'
keyboard-close = Tongko' papan katti'

choice-input-remove-choice = Pela'i { $choice }

matrix-remove-row = Pela'i baris
matrix-add-row = Tambai baris
matrix-remove-column = Pela'i kolom
matrix-add-column = Tambai kolom

subset-add-remove-points = Tamba/Pela' titik
subset-toggle-points-intervals = Sambei titik siagang selang
subset-move-points = Palette'i titik
subset-clear = Bissai

orbital-add-row = Tambai baris
orbital-remove-row = Pela'i baris
orbital-add-box = Tambai kotak
orbital-remove-box = Pela'i kotak
orbital-add-up-arrow = Tambai pana mange rate
orbital-add-down-arrow = Tambai pana mange rawa
orbital-remove-arrow = Pela'i pana

orbital-row-label = Label untu' baris { $row }

pretzel-answer = Jawaban



## Math input

math-input-preview-region = pratinjau ungkapan matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ungkapan sala:


## Document status

viewer-initializing = Nipasadia...


## Errors

error-heading = Kasalang

error-found-at =
    { $span ->
        [line] Nigappa ri baris { $startLine }.
       *[lines] Nigappa ri baris { $startLine }–{ $endLine }.
    }

document-contains-errors = Anne dokumenga nia' kasalanna!

diagnostic-heading-error = Kasalang
diagnostic-heading-warning = Pappakainga'
diagnostic-heading-information = Info
diagnostic-heading-hint = Petunju'

accessibility-heading-level-1 = Pelanggaran aksesibilitas WCAG AA
accessibility-heading-level-2 = Pappakainga' aksesibilitas

something-went-wrong = Nia' apa-apa sala.

renderer-load-failed = se're perender tena nakkulle nigappa. Muat pole anne halamanga.

core-start-failed = Anne dokumenga tena nakkulle nipa'jari. Muat pole anne halamanga.

core-start-failed-busy = Anne dokumenga tena nakkulle nipa'jari. Nia' siapa are dokumen appakkaramula sipa'rua, na akkulle la'bi sallo ri alat lambaka. Muat pole anne halamanga punna le'ba' ngaseng dokumen maraenga.

core-start-failed-retry = Anne dokumenga tena nakkulle nipa'jari.

core-start-failed-busy-retry = Anne dokumenga tena nakkulle nipa'jari. Nia' siapa are dokumen appakkaramula sipa'rua, na akkulle la'bi sallo ri alat lambaka.

core-start-retry = Coba pole

saved-state-unavailable = Jama-jamang katte le'baka niboli' tena nakkulle nigappa.
