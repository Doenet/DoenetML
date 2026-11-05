# Southern Sami (åarjelsaemien gïele) viewer chrome, Latin script. Translated
# from `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Southern Sami is spoken across the middle of Norway and Sweden and is the
# southernmost of the Sami languages. It is written in a Latin orthography of
# its own, and the first thing to check in this file is that no letter has
# leaked in from the Northern Sami catalog this seed sat beside. Southern Sami
# does **not** use `á`, `č`, `đ`, `ŋ`, `š`, `ŧ` or `ž`: it writes `tj` for
# Northern `č`, `sj` for Northern `š`, plain `d` and `t` for Northern `đ` and
# `ŧ`, and it carries three vowel letters Northern Sami has no use for — `ï`,
# `ä` and `ö` — plus `å`. Long vowels are doubled (`aa`, `ee`, `öö`) rather
# than accented. A stray `á` or `č` anywhere below is a bug, not a variant.
#
# The vocabulary differs from Northern Sami as much as the spelling does, and
# more than the spelling suggests: the two are not mutually intelligible.
# Where this seed had a Southern Sami word it used it («reaktoe»,
# «båajhtoes», «vaestiedasse», «raerie», «pryövenasse»); where it did not, it
# built the word from a Southern Sami root by the language's own derivation,
# and those are the words to check first. They are listed in the file that
# uses them.
#
# Southern Sami counts in a **dual**, as every Sami language does. CLDR gives
# it `one`, `two` and `other`, so a `{ $count -> … }` below that prints its
# number writes three branches, and the middle one is not a rounding of the
# plural: two of a thing is its own number, in the noun, in the pronoun and in
# the verb. `two` and `other` are written out separately even where they carry
# the same string today, because they are two categories and a later
# correction to one of them is unlikely to be a correction to both.
#
# `one` does not catch zero, so the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Gïehtjedeminie…
answer-submitting = Seedteminie…
answer-checking-status = Vaestiedassem gïehtjede
answer-submitting-status = Vaestiedassem seedtie
answer-correct = Reaktoe
answer-incorrect = Båajhtoes
answer-response-saved = Vaestiedasse vöörhkesovveme
answer-percent-credit = { $percent }% poengijste
answer-percent-correct = { $percent }% reaktoe
answer-percent-short = { $percent } %
max-credit-available = Jeenjemes poengh: { $percent }%
attempts-remaining =
    { $count ->
        [0] ij leah vielie pryövenassh baasedh
        [one] { $count } pryövenasse baasa
        [two] { $count } pryövenassh baasa
       *[other] { $count } pryövenassh baasa
    }
validation-correct = (Reaktoe)
validation-incorrect = (Båajhtoes)
validation-partially-correct = (Bielelen reaktoe)
# No select: the noun is the object of «vuesehth» and stands in the same form
# after every numeral, so all three categories would render one string. The
# count still arrives and is still formatted; only the branching is gone.
answer-show-responses = Vuesehth { $count } vaestiedassem daase: { $answerId }

## Disclosure panels

feedback-heading = Bïhkedasse
collapsible-click-to-open = (klikkh rïhpestidh)
collapsible-click-to-close = (klikkh gaptjedh)
collapsible-initializing = Aalkeminie…
footnote-show = Vuesehth vuelienotaatem
footnote-hide = Tjeakoesth vuelienotaatem
description-more-information = vielie bïevnesh

## Controls

slider-previous = Aerebi
slider-next = Mubpie
keyboard-open = Rïhpesth tastatuvrem
keyboard-close = Gaptjh tastatuvrem
choice-input-remove-choice = Vaeltieh { $choice }
matrix-remove-row = Vaeltieh raajesem
matrix-add-row = Lissieh raajesem
matrix-remove-column = Vaeltieh kolovnem
matrix-add-column = Lissieh kolovnem
subset-add-remove-points = Lissieh/vaeltieh tjuvtjieh
subset-toggle-points-intervals = Molsedh tjuvtjiej jïh gaskiej gaskem
subset-move-points = Juhtieh tjuvtjieh
subset-clear = Geerjehth
orbital-add-row = Lissieh raajesem
orbital-remove-row = Vaeltieh raajesem
orbital-add-box = Lissieh boeksem
orbital-remove-box = Vaeltieh boeksem
orbital-add-up-arrow = Lissieh njualam bijjese
orbital-add-down-arrow = Lissieh njualam vuelese
orbital-remove-arrow = Vaeltieh njualam
orbital-row-label = Raajesen { $row } nomme
pretzel-answer = Vaestiedasse

## Math input

math-input-preview-region = matematihkeles tjïelkestimmien åvtevuesiehtimmie
math-input-preview = Åvtevuesiehtimmie
math-input-invalid-expression = Faamoehts tjïelkestimmie:

## Document status

viewer-initializing = Aalkeminie…

## Errors

error-heading = Båajhtoehtimmie
error-found-at =
    { $span ->
        [line] Gaavneme raajesisnie { $startLine }.
       *[lines] Gaavneme raajesinie { $startLine }–{ $endLine }.
    }
document-contains-errors = Daennie dokumeentesne båajhtoehtimmieh!
diagnostic-heading-error = Båajhtoehtimmie
diagnostic-heading-warning = Vaaroehtimmie
diagnostic-heading-information = Bïevnese
diagnostic-heading-hint = Raerie
accessibility-heading-level-1 = WCAG AA jaksemevoeten rïhkestimmie
accessibility-heading-level-2 = Jaksemevoeten vaaroehtimmie
something-went-wrong = Mij akt båajhtoehke sjïdti.
renderer-load-failed = vuesiehtimmiemoduvle idtji veedtjesovvh. Veedtjh sæjroem vihth.
core-start-failed = Daate dokumeente idtji maehtieh aalkedh. Veedtjh sæjroem vihth.
core-start-failed-busy = Daate dokumeente idtji maehtieh aalkedh. Gellie dokumeenth seamma aejkien aelkiejin, jïh dïhte guhkiebasse vaasa slaavva mubpielisnie. Sæjroen orrestimmie viehkehte gosse jeatjah dokumeenth galhkeme.
core-start-failed-retry = Daate dokumeente idtji maehtieh aalkedh.
core-start-failed-busy-retry = Daate dokumeente idtji maehtieh aalkedh. Gellie dokumeenth seamma aejkien aelkiejin, jïh dïhte guhkiebasse vaasa slaavva mubpielisnie.
core-start-retry = Pryövh vihth
saved-state-unavailable = Dov vöörhkesovveme barkoe idtji veedtjesovvh.
