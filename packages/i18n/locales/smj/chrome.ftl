# Lule Sami (julevsámegiella) viewer chrome, Latin script. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lule Sami is spoken on both sides of the border in the Lule river valley and
# in Tysfjord, and it is the closest neighbour Northern Sami has — close
# enough that a reader who knows the Northern catalog will recognise most of
# this one. The orthography is where the two part company most visibly. Lule
# Sami keeps `á` and `ŋ`, but it has **no** `č`, `š`, `ž`, `đ` or `ŧ`: it
# writes `tj` for Northern `č` and `sj` for Northern `š`, plain `d` and `t`
# where Northern writes `đ` and `ŧ`, and it uses `å`, which Northern Sami does
# not. So Northern «čuokkis» is «tjuoggá» here, «šládja» is «sjláj», and
# «boastut» is «båsstot». A `č` or a `š` anywhere below is a bug, not a
# variant.
#
# The differences are not only spelling. The negative verb, the copula and the
# modals are their own words — «ij», «e», «la», «li», «hæhttu», «máhttá» —
# and the passive ends in `-duvvá` rather than Northern `-juvvo`. Where this
# seed had a Lule Sami word it used it; where it did not, it derived one by
# regular correspondence from the Northern Sami seed beside it, and those are
# the words to check first. Each file lists its own.
#
# Lule Sami counts in a **dual**, as every Sami language does. CLDR gives it
# `one`, `two` and `other`, so a `{ $count -> … }` below that prints its
# number writes three branches, and the middle one is not a rounding of the
# plural: two of a thing is its own number, in the noun, in the pronoun and in
# the verb. `two` and `other` are written out separately even where they carry
# the same string today — the noun is in the nominative singular after «akta»
# and in the genitive singular after «guokta» and every higher numeral, so the
# two share a form that neither shares with `one` — because they are two
# categories and a later correction to one of them is unlikely to be a
# correction to both.
#
# `one` does not catch zero, so the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Gehtjadimen…
answer-submitting = Sáddimin…
answer-checking-status = Gehtjada vásstádusáv
answer-submitting-status = Sáddi vásstádusáv
answer-correct = Riekta
answer-incorrect = Båsstot
answer-response-saved = Vásstádus la vuorkeduvvam
answer-percent-credit = { $percent }% tjuoggás
answer-percent-correct = { $percent }% riekta
answer-percent-short = { $percent } %
max-credit-available = Ieneplåhko tjuoggá: { $percent }%
attempts-remaining =
    { $count ->
        [0] e la ienep gæhttjalibme báhtsám
        [one] { $count } gæhttjalibme báhtsá
        [two] { $count } gæhttjalime báhtsá
       *[other] { $count } gæhttjalime báhtsá
    }
validation-correct = (Riekta)
validation-incorrect = (Båsstot)
validation-partially-correct = (Belludagá riekta)
# No select: the noun is the object of «vuoseda» and takes the accusative
# singular after every numeral, so all three categories would render the same
# string. The count still arrives and is still formatted; only the branching
# is gone.
answer-show-responses = Vuoseda { $count } vásstádusáv dási: { $answerId }

## Disclosure panels

feedback-heading = Ruopptutdiehto
collapsible-click-to-open = (tjåkkål rahpat)
collapsible-click-to-close = (tjåkkål gåptjet)
collapsible-initializing = Álggediminen…
footnote-show = Vuoseda vuolepnotáhtav
footnote-hide = Tjiegada vuolepnotáhtav
description-more-information = ienep diehto

## Controls

slider-previous = Åvddep
slider-next = Boahtte
keyboard-open = Raha båloboarda
keyboard-close = Gåptje båloboarda
choice-input-remove-choice = Válde erit { $choice }
matrix-remove-row = Válde erit linnjáv
matrix-add-row = Lasedi linnjáv
matrix-remove-column = Válde erit kolonnav
matrix-add-column = Lasedi kolonnav
subset-add-remove-points = Lasedi/válde erit tjuoggájt
subset-toggle-points-intervals = Molsu tjuoggáj ja gasskaj gaskan
subset-move-points = Sirdde tjuoggájt
subset-clear = Sálke
orbital-add-row = Lasedi linnjáv
orbital-remove-row = Válde erit linnjáv
orbital-add-box = Lasedi bårssav
orbital-remove-box = Válde erit bårssav
orbital-add-up-arrow = Lasedi njuolav bajás
orbital-add-down-arrow = Lasedi njuolav vuolus
orbital-remove-arrow = Válde erit njuolav
orbital-row-label = Linnjá { $row } namádus
pretzel-answer = Vásstádus

## Math input

math-input-preview-region = matematihkalasj tjielggidusá åvddåvuoseha
math-input-preview = Åvddåvuoseha
math-input-invalid-expression = Gusstuhis tjielggidus:

## Document status

viewer-initializing = Álggediminen…

## Errors

error-heading = Mieddádus
error-found-at =
    { $span ->
        [line] Gávnaduvvam linnján { $startLine }.
       *[lines] Gávnaduvvam linnjájn { $startLine }–{ $endLine }.
    }
document-contains-errors = Dán dokumentan li mieddádusá!
diagnostic-heading-error = Mieddádus
diagnostic-heading-warning = Várrudus
diagnostic-heading-information = Diehto
diagnostic-heading-hint = Ráde
accessibility-heading-level-1 = WCAG AA juksamvuoda rihkkom
accessibility-heading-level-2 = Juksamvuoda várrudus
something-went-wrong = Juoga manáj båsstot.
renderer-load-failed = vuosedimmoduvla ittjij vieteduvá. Vieta sijdov ådåsis.
core-start-failed = Dát dokumenta ittjij máhte álggeduvvat. Vieta sijdov ådåsis.
core-start-failed-busy = Dát dokumenta ittjij máhte álggeduvvat. Moadda dokumenta álggin siegen, mij máhttá guhkeb ájgev váldet nievres mássjinan. Sijdo ådåsisviehtjem máhttá viehkedit gå ietjá dokumenta li gærggam.
core-start-failed-retry = Dát dokumenta ittjij máhte álggeduvvat.
core-start-failed-busy-retry = Dát dokumenta ittjij máhte álggeduvvat. Moadda dokumenta álggin siegen, mij máhttá guhkeb ájgev váldet nievres mássjinan.
core-start-retry = Gæhttjala vilá
saved-state-unavailable = Duv vuorkeduvvam barggo ittjij vieteduvá.
