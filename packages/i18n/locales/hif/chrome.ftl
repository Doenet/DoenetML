# Fiji Hindi (Fiji Baat) viewer chrome: the buttons, panel headings and status
# words the reader interacts with. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, not Devanagari — and ICU disagrees.** `Intl.Locale("hif")`
# maximizes to `hif-Deva-FJ`, so anything reading the maximization believes
# this language is written in Devanagari. Its speakers do not write it that
# way. Fiji Hindi is written in the **Latin alphabet** wherever Fiji Hindi
# itself is written — the Fiji Hindi Wikipedia, the Fiji Hindi New Testament,
# the Fiji Hindi–English dictionaries, and the everyday writing of Indo-Fijians
# in Fiji, New Zealand and Australia. Devanagari in Fiji is the script of
# *Standard Hindi*, which is taught in school, read in the temple, and is a
# different language from the one people speak at home. Seeding this catalog in
# Devanagari would have produced a Standard Hindi catalog under a Fiji Hindi
# tag, which is the one thing this seed must not be.
#
# **Direction is unaffected, and that is why nothing had to change.** Both
# scripts run left to right, so `directionOf("hif")` answers `ltr` through the
# maximization and answers it correctly. `src/direction.ts` needs no entry for
# `hif`: the tag reaches the right answer by the wrong route, and here the
# wrong route costs nothing. It would not be free for a tag whose two candidate
# scripts ran in different directions, which is worth recording beside
# `locales/skr` and `locales/brh` in this same batch — those two are
# Perso-Arabic and *do* need the fallback list.
#
# **Spelling.** This catalog follows the conventional Latin orthography: `aa`
# for the long vowel where it is contrastive («kaam», «naam», «laal»), plain
# `a` elsewhere, `ch` and `chh`, `jaawe`/`hoe` for the imperfective, and no
# diacritics at all — Fiji Hindi is typed on an English keyboard and its
# writing reflects that. Retroflexes are not distinguished from dentals in
# writing, as they are not in the sources this follows.
#
# **No plural categories.** CLDR has no plural data for `hif`, so nothing here
# selects on a category and `lint:i18n` would reject one if it did. Nothing is
# lost: a Fiji Hindi noun after a numeral stays unmarked. `[0]` is kept where
# English has it — Fluent matches a numeric literal against the number itself
# before it consults any plural rule, so that branch is reachable whatever the
# locale.
#
# **Register.** The `-o` imperative («karo», «dekhao», «chuno»), which is the
# ordinary polite form and the only one that is safe not knowing who is being
# addressed.
#
# **English loans kept rather than replaced.** Schooling in Fiji is in English,
# and Fiji Hindi borrows from it freely and without apology: `keyboard`,
# `matrix`, `column`, `percent`, `orbital`, `WCAG`, `preview` are what a
# Fiji Hindi speaker actually says. Coining Hindi-Sanskrit replacements for
# them would produce Standard Hindi, not Fiji Hindi. Where Fiji Hindi has its
# own word it is used.


## Answer submission

answer-checking = Jaanch hoy rahaa hai...
answer-submitting = Bhej rahaa hai...
answer-checking-status = Jawaab ke jaanch hoy rahaa hai
answer-submitting-status = Jawaab bhej rahaa hai
answer-correct = Sahi
answer-incorrect = Galat
answer-response-saved = Jawaab save hoy gais
answer-percent-credit = { $percent }% marks
answer-percent-correct = { $percent }% sahi
answer-percent-short = { $percent } %
max-credit-available = Sab se jaada marks: { $percent }%
attempts-remaining =
    { $count ->
        [0] Koi mauka nai bachaa hai
       *[other] { $count } mauka bachaa hai
    }
validation-correct = (Sahi)
validation-incorrect = (Galat)
validation-partially-correct = (Thora sahi)
# «ke» is a postposition and stands as its own word, so nothing is joined to
# the placeable.
answer-show-responses = { $answerId } ke { $count } jawaab dekhao

## Disclosure panels

feedback-heading = Raay
collapsible-click-to-open = (kholne ke liye click karo)
collapsible-click-to-close = (band karne ke liye click karo)
collapsible-initializing = Taiyaar hoy rahaa hai...
footnote-show = Footnote dekhao
footnote-hide = Footnote chhupao
description-more-information = aur jaankaari

## Controls

slider-previous = Pichhla
slider-next = Agla
keyboard-open = Keyboard kholo
keyboard-close = Keyboard band karo
choice-input-remove-choice = { $choice } hatao
matrix-remove-row = Row hatao
matrix-add-row = Row jorho
matrix-remove-column = Column hatao
matrix-add-column = Column jorho
subset-add-remove-points = Point jorho/hatao
subset-toggle-points-intervals = Point aur interval ke beech badlo
subset-move-points = Point hilao
subset-clear = Saaf karo
orbital-add-row = Row jorho
orbital-remove-row = Row hatao
orbital-add-box = Box jorho
orbital-remove-box = Box hatao
orbital-add-up-arrow = Uupar ke arrow jorho
orbital-add-down-arrow = Niche ke arrow jorho
orbital-remove-arrow = Arrow hatao
orbital-row-label = Row { $row } ke naam
pretzel-answer = Jawaab
# «column» names what `$column` is, so the postposition falls behind a word
# this catalog writes rather than behind the value.

## Math input

math-input-preview-region = Math expression ke preview
math-input-preview = Preview
math-input-invalid-expression = Galat expression:

## Document status

viewer-initializing = Taiyaar hoy rahaa hai...

## Errors

error-heading = Galti
error-found-at =
    { $span ->
        [line] Line { $startLine } pe milaa.
       *[lines] Line { $startLine }–{ $endLine } pe milaa.
    }
document-contains-errors = Ii document me galti hai!
diagnostic-heading-error = Galti
diagnostic-heading-warning = Chetaawni
diagnostic-heading-information = Jaankaari
diagnostic-heading-hint = Ishaara
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = WCAG AA accessibility ke ulanghan
accessibility-heading-level-2 = Accessibility ke chetaawni
something-went-wrong = Kuchhu galat hoy gais.
renderer-load-failed = Ek renderer load nai hoy sakaa. Kirpa kare ke page ke phir se load karo.
core-start-failed = Ii document chaalu nai hoy sakaa. Kirpa kare ke page ke phir se load karo.
core-start-failed-busy = Ii document chaalu nai hoy sakaa. Bahut document ek hi time pe chaalu hoy rahaa rahin, aur dhiimaa device pe iske jaada time lage hai. Dusra document khatam hoy jaay ke baad page ke phir se load kare se madad mil sake hai.
core-start-failed-retry = Ii document chaalu nai hoy sakaa.
core-start-failed-busy-retry = Ii document chaalu nai hoy sakaa. Bahut document ek hi time pe chaalu hoy rahaa rahin, aur dhiimaa device pe iske jaada time lage hai.
core-start-retry = Phir se koshish karo
saved-state-unavailable = Tumhaar save karaa kaam load nai hoy sakaa.
