# Buginese (Basa Ugi) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, not Lontara.** Buginese has its own historic script,
# Lontara (ᨒᨚᨊᨈᨑ), and a reviewer may reasonably have expected it. This catalog
# writes **Latin**, for two reasons and neither of them a judgement about which
# script is the language's own. The first is that Latin is what Buginese is
# actually written in today in print, in newspapers, in schoolbooks and online,
# so it is the form a Buginese reader will read fastest. The second is
# structural: Lontara does not write the final glottal stop, the geminate
# consonants or the syllable-final nasal, so a Lontara catalog would spell
# «de'» and «dé», «wedding» and «weding» identically, and a reviewer could not
# tell a correction from a typo. Converting this catalog to Lontara means
# converting **all four files at once**, and it is a conversion rather than a
# transliteration, because the missing distinctions have to be supplied by
# someone who knows the words.
#
# **The glottal stop is written with the ASCII apostrophe `'` (U+0027)**,
# everywhere in all four files — «de'», «macella'», «tetti'», «soala'». The
# typographic apostrophe U+2019 is not used anywhere, so a search for `'` finds
# every one of them. `é` is written with an acute accent where the seed is
# confident of the vowel and left as plain `e` where it is not; that
# inconsistency is a limit of the seed rather than a spelling rule, and a
# speaker should regularize it in one pass.
#
# **The technical register is Indonesian, and it is declared rather than
# disguised.** Buginese speakers are schooled in Indonesian, and the words for
# a component, an attribute, a matrix, a percentage or a keyboard are the
# Indonesian ones because those are the words the community uses. They are
# written here as Indonesian, not respelled into a Buginese shape the language
# does not give them.
#
# **What is Buginese here is the frame**, and it is used consistently: «de'»
# for *tidak* and «de'gaga» for *tidak ada*, «wedding» for *dapat* (so *cannot*
# is «de' nawedding»), «sibawa» for *dengan*, «na» for *dan*, «iyaré'ga» for
# *atau*, «nasaba» for *karena*, «rékko» for *jika*, «naé» for *tetapi*,
# «pole ri» for *dari*, «untu'» for *untuk*, «ri» for *di*, «maneng» for
# *semua*, «tungke'» for *tiap*, «de'pa» for *belum*, «pura» for *sudah*,
# «riruntu'» for *ditemukan*, «paimeng» for *lagi*, and «idi'» as the polite
# second person. Content words that are Buginese rather than Indonesian —
# «tongeng», «sala», «pappébali», «pakkutana», «tetti'», «tanrang»,
# «gambara'», «jama-jamang», «riolo», «rimonri» — are used wherever the seed
# is confident of them.
#
# **The definite suffix `-é` is not written on the nouns these messages name.**
# Buginese marks a definite noun with `-é`, whose shape depends on the last
# sound of the word it attaches to, and several of these messages end in a
# placeable the catalog never sees. So the seed leaves the nouns bare —
# `content.ftl`'s whole `noun` table is citation forms — rather than welding a
# suffix onto a value. The enclitic does appear where it closes a relative
# clause the catalog writes out in full («iya riruntu'é», «iya weddingngé»),
# which is a different job and carries no placeable. The nouns themselves read
# as indefinite throughout, which is a real cost; a speaker adding the suffix
# should add it only where the word is one the catalog writes out.
#
# **Counts.** CLDR has no plural data for `bug`, so `Intl.PluralRules` would
# resolve it against the runtime's own locale and any `[one]` branch would be
# selected by English's rules. The two counted messages here collapse to a
# single `*[other]`, keeping only `attempts-remaining`'s explicit `[0]`, which
# Fluent matches against the number itself. A Buginese noun is unmarked after a
# numeral anyway, so one form is correct.


## Answer submission — the check-work button and the status it reports.

answer-checking = Riparessa...
answer-submitting = Rikiring...

answer-checking-status = Paressa pappébali
answer-submitting-status = Kiring pappébali

answer-correct = Tongeng
answer-incorrect = Sala

answer-response-saved = Pappébali pura ritaro

answer-percent-credit = Nilai { $percent }%
answer-percent-correct = { $percent }% tongeng
answer-percent-short = { $percent } %

max-credit-available = Nilai kaminang battoa iya weddingngé riala: { $percent }%

attempts-remaining =
    { $count ->
        [0] de'gaga na cobana iya masesaé
       *[other] masesa { $count } cobana
    }

validation-correct = (Tongeng)
validation-incorrect = (Sala)
validation-partially-correct = (Sibagéang tongeng)

answer-show-responses = Paitangngi { $count } pappébali untu' { $answerId }


## Disclosure panels

feedback-heading = Pappébali balé

collapsible-click-to-open = (klik untu' timpa')
collapsible-click-to-close = (klik untu' tutu')

collapsible-initializing = Rispakkang...

footnote-show = Paitangngi catatang yawa
footnote-hide = Subbui catatang yawa

description-more-information = keterangan lebbi maéga


## Controls

slider-previous = Riolo
slider-next = Rimonri

keyboard-open = Timpa' papan tikkeng
keyboard-close = Tutu' papan tikkeng

choice-input-remove-choice = Abbéangngi { $choice }

matrix-remove-row = Abbéangngi baris
matrix-add-row = Tambai baris
matrix-remove-column = Abbéangngi kolom
matrix-add-column = Tambai kolom

subset-add-remove-points = Tamba/Abbéang tetti'
subset-toggle-points-intervals = Sélléi tetti' sibawa selang
subset-move-points = Léttéi tetti'
subset-clear = Paccingngi

orbital-add-row = Tambai baris
orbital-remove-row = Abbéangngi baris
orbital-add-box = Tambai kotak
orbital-remove-box = Abbéangngi kotak
orbital-add-up-arrow = Tambai pana liyasé
orbital-add-down-arrow = Tambai pana liyawa
orbital-remove-arrow = Abbéangngi pana

orbital-row-label = Label untu' baris { $row }

pretzel-answer = Pappébali



## Math input

math-input-preview-region = pratinjau ungkapan matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ungkapan de' nasah:


## Document status

viewer-initializing = Rispakkang...


## Errors

error-heading = Asalang

error-found-at =
    { $span ->
        [line] Riruntu' ri baris { $startLine }.
       *[lines] Riruntu' ri baris { $startLine }–{ $endLine }.
    }

document-contains-errors = Dokumen iyaé engka asalanna!

diagnostic-heading-error = Asalang
diagnostic-heading-warning = Papparingerrang
diagnostic-heading-information = Info
diagnostic-heading-hint = Petunju'

accessibility-heading-level-1 = Pelanggaran aksesibilitas WCAG AA
accessibility-heading-level-2 = Papparingerrang aksesibilitas

something-went-wrong = Engka iya salaé.

renderer-load-failed = séddi perender de' nawedding riala. Taassuroi paimeng halaman iyaé.

core-start-failed = Dokumen iyaé de' nawedding ripaompo. Taassuroi paimeng halaman iyaé.

core-start-failed-busy = Dokumen iyaé de' nawedding ripaompo. Engka maéga dokumen iya mappammulaé massidi, iya weddingngé lebbi maitta ri alat malamma. Taassuroi paimeng halaman iyaé rékko pura maneng dokumen laingngé.

core-start-failed-retry = Dokumen iyaé de' nawedding ripaompo.

core-start-failed-busy-retry = Dokumen iyaé de' nawedding ripaompo. Engka maéga dokumen iya mappammulaé massidi, iya weddingngé lebbi maitta ri alat malamma.

core-start-retry = Coba paimeng

saved-state-unavailable = Jama-jamang idi' iya puraé ritaro de' nawedding riala.
