# Tausug viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Tausug** (Bahasa Sūg), the Bisayan language of the Sulu archipelago, of
# Zamboanga and Basilan in the Philippines, and of Sabah in Malaysia.
#
# **SCRIPT: LATIN, AND THE ARGUMENT FOR IT.** Tausug has two written
# traditions. **Sulat Sūg** — the Jawi-derived Arabic script — is the older,
# is still written for religious material and in personal use, and is the one
# a reader may feel the language properly belongs in. **Latin** is what
# Philippine MTB-MLE schoolbooks, dictionaries, Bible and Qur'an translations
# and everything on a screen are set in today. This catalog is **Latin**, for
# a reason about this software rather than about the language: these strings
# sit beside DoenetML source, attribute names and mathematics that are Latin
# and left-to-right, and a right-to-left Arabic-script catalog would put a
# bidi boundary in the middle of nearly every message here. A reader who
# wants Sulat Sūg should have a catalog of its own rather than a mixture, and
# nothing in this file should be converted piecemeal: **all four files at
# once, or none.**
#
# ORTHOGRAPHY. Tausug has three vowel qualities — **a, i, u** — and this
# catalog writes only those, each in a plain and a **macron** form: «ā», «ī»,
# «ū» mark the long vowel the Tausug dictionary tradition marks, in «Sūg»,
# «sāya», «katān», «pī'», «siyusūd». The macron is a length mark rather than a
# stress mark or a fourth vowel, it is written on the same words every time
# they appear, and **stripping it is a respelling rather than a
# simplification**. The glottal stop is written with an **apostrophe**
# («puti'», «sala'», «pana'») — the ASCII `'`, never a curly quote — and a
# doubled consonant is a real length contrast in a consonant («bunnal»,
# «gaddung»), not a typo. Loanwords are the one place the three
# vowels break down: rather than respell a borrowing into an invented Tausug
# phonology, this catalog **keeps a loan in the spelling of the language it
# was borrowed from** — «kolum», «pahina», «solusyon», «rombo», «sirkulo»,
# «teorema» — and says so here.
#
# **THE LINKER.** Tausug joins a modifier to what it modifies with **«nga»**,
# and «nga» is a free word in every position — it does not contract onto the
# word before it the way Kapampangan's and Bikol's linkers do. So this catalog
# writes it out everywhere and never has to know what stands beside a
# placeable. That is the escape `locales/ceb`, `locales/war` and `locales/hil`
# already take, and it is why the composition messages in
# `locales/tsg/content.ftl` can put the adjectives **in front of** the noun.
#
# THREE LAYERS, ALL DECLARED. Tausug's technical register is not one thing:
#
#   - a **Malay layer**, old and thoroughly Tausug: «atawa» (or), «iban»
#     (and, with), «kuning», «biru», «titik», «baris»;
#   - an **Arabic layer** through Islam: «ma'na» (definition), «misalan»
#     (example), «parakala'» (problem, matter);
#   - a **Filipino/Spanish and English layer** from the school system, which
#     is where the mathematics comes from: «sirkulo», «rombo»,
#     «triyanggulo», «kuwadrado», «solusyon», and the English terms this
#     catalog keeps whole because the classroom does.
#
# **THE GRAMMATICAL ASSUMPTION THIS SEED MAKES, STATED IN ONE PLACE.** Tausug
# verbs are written here as **`nag-` plus CV-reduplication for the
# progressive** («Nagpapariksa») and as **bare or `-a`-suffixed roots for the
# imperative** («Dugang», «Tapuka»). If Tausug builds either otherwise, every
# verb in these four files is wrong in the same predictable way, and one pass
# fixes all of them. The particles around them are not assumed: **«in»**
# (topic), **«sin»** (genitive), **«ha»** (oblique), **«dayn ha»** (from),
# **«manga»** (plural), **«awn»** (there is) and **«way»** (there is none)
# are Tausug and are the words to check this file by.
#
# **THE THREE NEGATORS ARE KEPT APART**, which is the other quick check:
# **«di'»** before a verb, **«bukun»** before a noun or an identification,
# **«way»** for "there is none". A stray Filipino «hindi» or «wala» would be
# a defect.
#
# WHAT THIS CATALOG DOES NOT KNOW. It has no settled Tausug word for
# "feedback" and writes «Panghindu'», which properly means instruction; and
# it keeps the English `renderer` and `keyboard`. Those three are the first
# places to look.
#
# PLURALS. `Intl.PluralRules` has no data for `tsg`, so a `[one]` branch would
# be selected by the runtime's default locale rather than by Tausug — and
# Tausug would not want one, since a noun after a numeral takes no «manga» and
# no other marking. Every count select is collapsed to a single `*[other]`. An
# explicit `[0]` is matched against the number itself rather than against a
# plural category, so it stays.


## Answer submission

answer-checking = Nagpapariksa…
answer-submitting = Nagpapasampay…
answer-checking-status = Nagpapariksa sin sambag
answer-submitting-status = Nagpapasampay sin sambag
answer-correct = Tama'
answer-incorrect = Sala'
answer-response-saved = Naitipun na in sambag
answer-percent-credit = { $percent }% nga marka
answer-percent-correct = { $percent }% tama'
answer-percent-short = { $percent } %
max-credit-available = In marka nga landu' mataas: { $percent }%
attempts-remaining =
    { $count ->
        [0] way na pagsulay
       *[other] { $count } pagsulay pa
    }
validation-correct = (Tama')
validation-incorrect = (Sala')
validation-partially-correct = (Tama' in kaibanan)
answer-show-responses =
    { $count ->
       *[other] Pakita' in { $count } sambag ha { $answerId }
    }


## Disclosure panels

feedback-heading = Panghindu'
collapsible-click-to-open = (pindut ha pag-ukab)
collapsible-click-to-close = (pindut ha pagtambul)
collapsible-initializing = Nagsasakap…
footnote-show = Pakita' in nuta ha babaan
footnote-hide = Tapuka in nuta ha babaan
description-more-information = dugang kaingatan


## Controls

slider-previous = Nakauna
slider-next = Sumunud
keyboard-open = Ukab Keyboard
keyboard-close = Tambul Keyboard
choice-input-remove-choice = Tanggal { $choice }
matrix-remove-row = Tanggal baris
matrix-add-row = Dugang baris
matrix-remove-column = Tanggal kolum
matrix-add-column = Dugang kolum
subset-add-remove-points = Dugang/Tanggal manga titik
subset-toggle-points-intervals = Pagsalli' manga titik iban interval
subset-move-points = Pinda Manga Titik
subset-clear = Hapus
orbital-add-row = Dugang Baris
orbital-remove-row = Tanggal Baris
orbital-add-box = Dugang Kahun
orbital-remove-box = Tanggal Kahun
orbital-add-up-arrow = Dugang Pana' Pataas
orbital-add-down-arrow = Dugang Pana' Pababa'
orbital-remove-arrow = Tanggal Pana'
orbital-row-label = Label sin baris { $row }
pretzel-answer = Sambag


## Math input

math-input-preview-region = pagkita' pauna sin ekspresyon matematika
math-input-preview = Pagkita' Pauna
math-input-invalid-expression = Ekspresyon sala':


## Document status

viewer-initializing = Nagsasakap…


## Errors

error-heading = Kasala'an
error-found-at =
    { $span ->
        [line] Kiyabaakan ha baris { $startLine }.
       *[lines] Kiyabaakan ha manga baris { $startLine }–{ $endLine }.
    }
document-contains-errors = In dukumintu ini awn kasala'an!
diagnostic-heading-error = Kasala'an
diagnostic-heading-warning = Pagpahati'
diagnostic-heading-information = Kaingatan
diagnostic-heading-hint = Panuntun
accessibility-heading-level-1 = Paglanggal sin akses WCAG AA
accessibility-heading-level-2 = Pagpahati' pasal akses
something-went-wrong = Awn nasala'.
renderer-load-failed = way nakarga hambuuk renderer. Balika pagkarga in pahina.
core-start-failed = In dukumintu ini di' nakatagna'. Balika pagkarga in pahina.
core-start-failed-busy = In dukumintu ini di' nakatagna'. Mataud dukumintu in nagtagna' ha hangka-waktu, iban malugay pa ini ha kasangkapan nga mahinay. Bang nakaubus na in kaibanan dukumintu, in pagbalik pagkarga sin pahina makatabang.
core-start-failed-retry = In dukumintu ini di' nakatagna'.
core-start-failed-busy-retry = In dukumintu ini di' nakatagna'. Mataud dukumintu in nagtagna' ha hangka-waktu, iban malugay pa ini ha kasangkapan nga mahinay.
core-start-retry = Sulaya Magbalik
saved-state-unavailable = In hinang mu nga naitipun di' nakarga.
