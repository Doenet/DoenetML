# Kʼicheʼ viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the ALMG orthography — the Academia de Lenguas Mayas de Guatemala's
# 1987 alphabet, which is the one Guatemalan bilingual education uses. Where
# Kʼicheʼ has no settled term, this catalog writes either a Spanish loan that is
# in ordinary use or a transparent compound, and never a coinage it invents from
# nothing; a purist correction is a legitimate correction.
#
# **Kʼicheʼ is the roster's first ergative–absolutive language, and it brings the
# first *prefix* that cannot be welded to a placeable.** The possessive and
# ergative marker is «u-» before a consonant and «r-» before a vowel, so its shape
# is decided by the **first sound of the word after it**. Every entry in the
# README's table for this constraint is a suffix, decided by the word before —
# this is the same problem seen from the other end, and the closest thing to it in
# the roster is `locales/lb`'s Eifeler Regel, which is also decided by what
# follows but as a deletion rather than a choice.
#
# Nowhere in these catalogs does «u-»/«r-» land on a value. Where the English
# possessed one, this catalog writes «rech» — "of", a free relational word — and
# the prefix on it is fixed because «rech» is a word this file writes.
#
# Inanimate nouns take no plural, so a counted message has one form and its select
# is dropped, keeping the `[0]` wording that names none — a different sentence
# rather than a different form.


## Answer submission

answer-checking = Kanikʼoxik…
answer-submitting = Kataqik…
answer-checking-status = Kanikʼoxik ri tzalijisabʼal
answer-submitting-status = Kataqik ri tzalijisabʼal
answer-correct = Utz
answer-incorrect = Man utz taj
answer-response-saved = Xkʼol ri tzalijisabʼal
answer-percent-credit = { $percent }% rajil
answer-percent-correct = { $percent }% utz
answer-percent-short = { $percent } %
max-credit-available = Ri nimalaj rajil kʼo: { $percent }%
# No select: «tijonik» is inanimate and takes no plural, so both English
# categories render the same words. The count still arrives and is still
# formatted. `[0]` stays, because "none left" is its own sentence.
attempts-remaining =
    { $count ->
        [0] maj chi tijonik kʼo kanaj
       *[other] { $count } tijonik kʼo kanaj
    }
validation-correct = (Utz)
validation-incorrect = (Man utz taj)
validation-partially-correct = (Jubʼiqʼ utz)
# No select, for the reason given above. The answer is reached with «rech» rather
# than with the possessive prefix, whose shape `$answerId`'s first sound would
# decide.
answer-show-responses = Chakʼutu { $count } tzalijisabʼal rech { $answerId }

## Disclosure panels

feedback-heading = Tzalijisan tzij
collapsible-click-to-open = (chapitzʼa rech kajaqik)
collapsible-click-to-close = (chapitzʼa rech katzʼapix)
collapsible-initializing = Kachaplebʼex…
footnote-show = Chakʼutu ri tzʼibʼ pa uxeʼ
footnote-hide = Chawewaj ri tzʼibʼ pa uxeʼ
description-more-information = kʼi na etamabʼal

## Controls

slider-previous = Nabʼe
slider-next = Kʼisbʼal
keyboard-open = Chajaqa ri kʼutbʼal tzʼibʼ
keyboard-close = Chatzʼapij ri kʼutbʼal tzʼibʼ
choice-input-remove-choice = Chesaj { $choice }
matrix-remove-row = Chesaj jun wokaj
matrix-add-row = Chakoj jun wokaj
matrix-remove-column = Chesaj jun tikbʼal
matrix-add-column = Chakoj jun tikbʼal
subset-add-remove-points = Chakoj/Chesaj tzʼubʼ
subset-toggle-points-intervals = Chakʼexa tzʼubʼ rukʼ nikʼajibʼal
subset-move-points = Chasilabʼisaj ri tzʼubʼ
subset-clear = Chachup
orbital-add-row = Chakoj jun wokaj
orbital-remove-row = Chesaj jun wokaj
orbital-add-box = Chakoj jun kaxa
orbital-remove-box = Chesaj jun kaxa
orbital-add-up-arrow = Chakoj jun chʼabʼ upa akʼanibʼal
orbital-add-down-arrow = Chakoj jun chʼabʼ upa qajibʼal
orbital-remove-arrow = Chesaj jun chʼabʼ
orbital-row-label = Ubʼiʼ ri wokaj { $row }
pretzel-answer = Tzalijisabʼal

## Math input

math-input-preview-region = kʼutbʼal rech ri ajilanik tzij
math-input-preview = Nabʼe kʼutbʼal
math-input-invalid-expression = Man utz taj ri tzij:

## Document status

viewer-initializing = Kachaplebʼex…

## Errors

error-heading = Sachbʼal
error-found-at =
    { $span ->
        [line] Xriqitaj pa ri juchʼ { $startLine }.
       *[lines] Xriqitaj pa ri juchʼ { $startLine }–{ $endLine }.
    }
document-contains-errors = Wa wuj kʼo sachbʼal chupam!
diagnostic-heading-error = Sachbʼal
diagnostic-heading-warning = Pixabʼ
diagnostic-heading-information = Etamabʼal
diagnostic-heading-hint = Tobʼanik
accessibility-heading-level-1 = WCAG AA sachbʼal rech okibʼal
accessibility-heading-level-2 = Pixabʼ rech okibʼal
something-went-wrong = Kʼo jasachike man utz taj xbʼantajik.
renderer-load-failed = jun kʼutunel man xoponik taj. Chakʼexa chi ri wuj.
core-start-failed = Ri ilonel rech wuj man xkowin taj kachaplebʼexik. Chakʼexa chi ri wuj.
