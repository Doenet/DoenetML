# Mískito viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Latin orthography of the Nicaraguan Caribbean
# coast, the one the Moravian mission established in the nineteenth century and
# the one the Nicaraguan and Honduran bilingual schools use today:
# `a b d h i k l m n o p r s t u w y`, with `ng` and the diphthongs `ai` and
# `aw`. Four notes.
#
#   * **`ng` is one sound**, the velar nasal, and is written as the digraph:
#     «sangni». It is never written `ñ` and never `n` alone.
#   * **`aw` and `ai` are the two diphthongs** and are written with `w` and `i`
#     rather than with `u` and `y`: «lawana», «pain», «kaisa». The loans in
#     these files follow the same rule — «brawn», «bakrawn», «raw».
#   * **`h` is a consonant that is pronounced** — «pihni», «lalahni» — and not a
#     silent letter or a length mark, which is where a Spanish-reading eye goes
#     wrong first.
#   * `c`, `f`, `g`, `j`, `q`, `v`, `x` and `z` are **not** in the alphabet, and
#     `k` does the work Spanish gives to `c` and `qu`. Every loan below is
#     respelled to obey that: Spanish `g` becomes `k` the way «gallina» became
#     «kalila», `v` becomes `b`, `j` becomes `h`, `z` and `c`-before-`e` become
#     `s`, and `f` becomes `p`.
#
# The language is named «Mískito» in all four of these files, with the accent.
# The accentless «Miskitu», which is what the Nicaraguan orthography itself
# increasingly writes, is not mixed into these headers.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `miq`; it falls back to
# the default locale and reports `one` and `other`, categories Mískito does not
# select. A Mískito noun after a numeral takes no plural marker — the plural
# «nani» is not used with a count — so English's `one` and `other` branches are
# one string here, written as **one unselected form** (`answer-show-responses`).
# English's explicit `[0]` literal in `attempts-remaining` matches the number
# itself rather than a category, and is kept.
#
# **Loans.** Mískito has no native software register but borrows freely for
# one, from Spanish on the Nicaraguan coast and from English through the
# Moravian mission and the Honduran Mosquitia. This file carries, from English,
# «kredit», «trai», «kliks», «kibord», «baks», «raw», «kolum», «arru», «nut»,
# «ansa», «dukumint», «rindarar» and «WCAG»; from Spanish, «puntu»,
# «interbalu», «estadistika», «matematika», «aksesibilidad» and «pista». The
# frame around them is Mískito: native verbs («kaikaia» to look, «mangkaia» to
# put, «sakaia» to take out, «kwakaia» to open, «prakaia» to close), the
# negator «apia» following what it negates, SOV order, and the copulas `sa` and
# `kaisa`.
#
# **Confidence.** Every key in the English catalog is translated. The weakest
# words are «Saura» for *error* (the ordinary word for *bad*, doing duty for a
# technical noun), «Aisanka» for *feedback* (a nominalized *saying*), and
# «Rindarar», a bare English loan for a thing the language has no name for at
# all. The button texts take the plain imperative — «kaiks», «bliks», «muns» —
# which is what a Mískito instruction sounds like.


## Answer submission

answer-checking = Kaiki sa...
answer-submitting = Blikisa...
answer-checking-status = Ansa ba kaiki sa
answer-submitting-status = Ansa ba blikisa
answer-correct = Pain
answer-incorrect = Pain apia
answer-response-saved = Ansa ba mangkan
answer-percent-credit = { $percent }% kredit
answer-percent-correct = { $percent }% pain
answer-percent-short = { $percent } %
max-credit-available = Kredit tara briaia sip ba: { $percent }%
attempts-remaining =
    { $count ->
        [0] trai kum bara apia
       *[other] trai { $count } bara
    }
validation-correct = (Pain)
validation-incorrect = (Pain apia)
validation-partially-correct = (Tila pain)
answer-show-responses = { $answerId } dukiara ansa { $count } marikaia


## Disclosure panels

feedback-heading = Aisanka
collapsible-click-to-open = (kwakaia dukiara kliks muns)
collapsible-click-to-close = (prakaia dukiara kliks muns)
collapsible-initializing = Ta krikisa...
footnote-show = Nut marikaia
footnote-hide = Nut bikaia
description-more-information = tanka kau


## Controls

slider-previous = Pas
slider-next = Wala
keyboard-open = Kibord Kwakaia
keyboard-close = Kibord Prakaia
choice-input-remove-choice = { $choice } sakaia
matrix-remove-row = Raw sakaia
matrix-add-row = Raw mangkaia
matrix-remove-column = Kolum sakaia
matrix-add-column = Kolum mangkaia
subset-add-remove-points = Puntu mangkaia/sakaia
subset-toggle-points-intervals = Puntu wal interbalu nani ba lakaia
subset-move-points = Puntu nani brih waia
subset-clear = Sut sakaia
orbital-add-row = Raw Mangkaia
orbital-remove-row = Raw Sakaia
orbital-add-box = Baks Mangkaia
orbital-remove-box = Baks Sakaia
orbital-add-up-arrow = Arru pura mangkaia
orbital-add-down-arrow = Arru munhta mangkaia
orbital-remove-arrow = Arru sakaia
orbital-row-label = Raw { $row } nina
pretzel-answer = Ansa


## Math input

math-input-preview-region = matematika ulbanka kaikanka
math-input-preview = Kaikanka
math-input-invalid-expression = Ulbanka pain apia:


## Document status

viewer-initializing = Ta krikisa...


## Errors

error-heading = Saura
error-found-at =
    { $span ->
        [line] Lain { $startLine } ra sakan.
       *[lines] Lain { $startLine }–{ $endLine } ra sakan.
    }
document-contains-errors = Naha dukumint ra saura nani bara!
diagnostic-heading-error = Saura
diagnostic-heading-warning = Warnin
diagnostic-heading-information = Tanka
diagnostic-heading-hint = Pista
accessibility-heading-level-1 = WCAG AA aksesibilidad saura
accessibility-heading-level-2 = Aksesibilidad warnin
something-went-wrong = Diara kum saura takan.
renderer-load-failed = rindarar kum balras. Wahia ba kli kwaks.
core-start-failed = Naha dukumint ba ta krikras. Wahia ba kli kwaks.
core-start-failed-busy = Naha dukumint ba ta krikras. Dukumint manis pyua kumi ra ta krikan, bara masinka sirpi ra baha pyua manis brisa. Dukumint wala nani tnata alkbia taim, wahia ba kli kwakaia ba help munbia.
core-start-failed-retry = Naha dukumint ba ta krikras.
core-start-failed-busy-retry = Naha dukumint ba ta krikras. Dukumint manis pyua kumi ra ta krikan, bara masinka sirpi ra baha pyua manis brisa.
core-start-retry = Kli traiks
saved-state-unavailable = Man warkkam mangkan ba sakaia sip apia kan.
