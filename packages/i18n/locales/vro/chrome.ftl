# Võro viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Võro is a written standard of its own, not an Estonian spelling.** It is
# the South Estonian literary language of Võrumaa, standardised by the Võro
# Instituut, printed in its own schoolbooks and newspaper, and given the ISO
# 639-3 code `vro` separately from `et`. A reader who arrives here is not
# getting Estonian with the vowels moved; they are getting another language
# that happens to be the nearest neighbour of the one in `locales/et`.
#
# Three of the differences are visible in this file rather than argued for in
# a header:
#
#   `q`   the glottal stop, a letter in its own right. It carries the plural
#         («punktiq», points) and the imperative plural, so it appears in this
#         catalog's buttons wherever Estonian would end a word in a vowel.
#   `y`   the high back unrounded vowel [ɨ], which is a separate letter from
#         `õ` in the Võro standard. It shows up here in «sys» — Estonian
#         «siis», then — and nowhere else, because no other word this catalog
#         needed carries it.
#   its own words, not Estonian ones spelled differently: «verrev» for red,
#         «haljas» for green, «nulk» for an angle or a corner, «vai» for or,
#         «ku» for if, «näüdüs» for an example, «jago» for a section. Those
#         are lexical facts about South Estonian, and a reader who reads them
#         as Estonian typos will "correct" them into the wrong language.
#
# Võro also suffixes its negation — «olõ-i» beside «ei olõ» — and both are
# standard. This catalog writes the analytic form throughout, which is the
# safer of the two for a seed; a speaker may well prefer the suffixed form in
# the short button strings. It is written «ei olõq», with the final q that
# marks the Võro connegative, in all four files: `diagnostics.ftl` had it in
# every one of its fifty-five negations while the other three files dropped it
# in seven, which is the one spelling this catalog has to choose rather than
# leave to a reviewer.
#
# Võro counts in two plural categories, `one` and `other`, the same two English
# and Estonian have, so every `{ $count -> … }` below keeps the shape it had.
# The noun after a numeral stands in the partitive singular — «2 katsõt», not a
# plural — so the `other` branch is one form rather than two.


## Answer submission

answer-checking = Kontrolli…
answer-submitting = Saada…
answer-checking-status = Vastussõ kontrollminõ
answer-submitting-status = Vastussõ saatminõ
answer-correct = Õigõ
answer-incorrect = Vale
answer-response-saved = Vastus om salvõtõt
answer-percent-credit = { $percent }% punktõst
answer-percent-correct = { $percent }% õigõ
answer-percent-short = { $percent } %
max-credit-available = Suurmb võimalik punktisumma: { $percent }%
attempts-remaining =
    { $count ->
        [0] katsit inämb ei olõq
        [one] perrä om jäänüq { $count } katsõq
       *[other] perrä om jäänüq { $count } katsõt
    }
validation-correct = (Õigõ)
validation-incorrect = (Vale)
validation-partially-correct = (Osalt õigõ)
answer-show-responses =
    { $count ->
        [one] Näütäq { $count } vastust küsümüsele { $answerId }
       *[other] Näütäq { $count } vastust küsümüsele { $answerId }
    }

## Disclosure panels

feedback-heading = Tagasiside
collapsible-click-to-open = (klõpsakõq vallalõtegemises)
collapsible-click-to-close = (klõpsakõq kinnipandmisõs)
collapsible-initializing = Käümäpanõk…
footnote-show = Näütäq allmärkust
footnote-hide = Käkiq allmärkus
description-more-information = inämb teedüst

## Controls

slider-previous = Tagasi
slider-next = Edesi
keyboard-open = Tekeq klaviatuur vallalõ
keyboard-close = Pangõq klaviatuur kinniq
choice-input-remove-choice = Võtaq ärq { $choice }
matrix-remove-row = Võtaq rida ärq
matrix-add-row = Lisäq rida
matrix-remove-column = Võtaq veerg ärq
matrix-add-column = Lisäq veerg
subset-add-remove-points = Lisäq/võtaq ärq punktõ
subset-toggle-points-intervals = Vaeldaq punktõ ja vaihmikkõ vaihõl
subset-move-points = Liigutagõq punktõ
subset-clear = Tühändäq
orbital-add-row = Lisäq rida
orbital-remove-row = Võtaq rida ärq
orbital-add-box = Lisäq kast
orbital-remove-box = Võtaq kast ärq
orbital-add-up-arrow = Lisäq nuul üles
orbital-add-down-arrow = Lisäq nuul alla
orbital-remove-arrow = Võtaq nuul ärq
orbital-row-label = Rea { $row } silt
pretzel-answer = Vastus

## Math input

math-input-preview-region = matõmaatilidsõ avaldusõ iinvaatus
math-input-preview = Iinvaatus
math-input-invalid-expression = Vigalinõ avaldus:

## Document status

viewer-initializing = Käümäpanõk…

## Errors

error-heading = Viga
error-found-at =
    { $span ->
        [line] Löüt reält { $startLine }.
       *[lines] Löüt ridulõ { $startLine }–{ $endLine }.
    }
document-contains-errors = Seon dokumendin om vikõ!
diagnostic-heading-error = Viga
diagnostic-heading-warning = Hoiatus
diagnostic-heading-information = Teedüs
diagnostic-heading-hint = Vihjeq
accessibility-heading-level-1 = WCAG AA ligipääsemise rikminõ
accessibility-heading-level-2 = Ligipääsemise teedüsandminõ
something-went-wrong = Midägi läts vallalõ.
renderer-load-failed = näütämismuudulit es saaq laadiq. Laadigõq leheküleq vahtsõst.
core-start-failed = Dokumendinäütäjät es saaq käümä panda. Laadigõq leheküleq vahtsõst.
core-start-failed-busy = Dokumendinäütäjät es saaq käümä panda. Üttekõrraga pantas käümä mitut dokumenti, miä võiva aiglatsõmba massina pääl kavvõmb aigu võttaq. Ku tõõsõq dokumendiq ommaq valmis, sys või api ollaq leheküle vahtsõst laatmisõst.
core-start-failed-retry = Dokumendinäütäjät es saaq käümä panda.
core-start-failed-busy-retry = Dokumendinäütäjät es saaq käümä panda. Üttekõrraga pantas käümä mitut dokumenti, miä või aiglatsõmba massina pääl kavvõmb aigu võttaq.
core-start-retry = Pruuvkõq viil kõrd
saved-state-unavailable = Teie salvõtõt tüüd es saaq laadiq.
