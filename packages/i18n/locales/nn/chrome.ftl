# Norwegian Nynorsk viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Nynorsk is a written standard of its own, not a spelling of Bokmål.** This
# is the `locales/hr` beside `locales/sr` case and the `locales/tn` beside
# `locales/st` case: two standards, two directories, and copying either over
# the other would be wrong in both. `locales/nb` was read line by line while
# this was written and it is deliberately *not* reproduced — «ikkje» for
# «ikke», «kva» for «hva», «frå» for «fra», «eit» for «et», «sida» for
# «siden», «berre» for «bare», «noko» for «noe», «fleire» for «flere»,
# «korleis» for «hvordan». A corrector who "fixes" any of those toward Bokmål is
# converting this file into `locales/nb`.
#
# **Negotiation.** `nn` is left out of `LANGUAGE_ALIASES` on purpose and must
# stay out. `no`, the macrolanguage over both standards, is rewritten to `nb`
# in `negotiate.ts`, and that stays as it is: a reader who says `no` has not
# said which standard they read, and Bokmål is what CLDR fills a bare `no` in
# as. What this catalog changes is only that `nn` now reaches a catalog of its
# own instead of falling to English. `negotiate.test.ts` holds both halves.
#
# **Number.** CLDR *does* have plural rules for `nn` — `one` and `other`, the
# same two Bokmål has — so a category branch here is selected by Nynorsk's own
# rules rather than by the runtime's default language. That is the split this
# batch runs along, and the header of every catalog in it says which side it is
# on: eight of the fifteen have CLDR data and seven do not.
#
# Where a select is dropped it is dropped for a reason in the grammar and not
# for want of rules: «forsøk» and «svar» are neuter and are spelled the same in
# the singular and the plural, so a `one`/`other` split would write the same
# string twice.
#
# Register: impersonal, and an instruction is the imperative («Last inn sida på
# nytt»), which is what Norwegian software uses in both standards.


## Answer submission

answer-checking = Sjekkar…
answer-submitting = Sender…
answer-checking-status = Sjekkar svaret
answer-submitting-status = Sender svaret
answer-correct = Rett
answer-incorrect = Feil
answer-response-saved = Svaret er lagra
answer-percent-credit = { $percent } % poeng
answer-percent-correct = { $percent } % rett
answer-percent-short = { $percent } %
max-credit-available = Høgste oppnåelege poengsum: { $percent } %
# «forsøk» is neuter and unchanged in the plural, so the `one`/`other` split
# English draws would write one string twice. The `[0]` branch is matched
# against the number itself and stays.
attempts-remaining =
    { $count ->
        [0] ingen forsøk att
       *[other] { $count } forsøk att
    }
validation-correct = (Rett)
validation-incorrect = (Feil)
validation-partially-correct = (Delvis rett)
# «svar» is neuter and unchanged in the plural, as «forsøk» is.
answer-show-responses = Vis { $count } svar til { $answerId }

## Disclosure panels

feedback-heading = Tilbakemelding
collapsible-click-to-open = (klikk for å opne)
collapsible-click-to-close = (klikk for å lukke)
collapsible-initializing = Startar opp…
footnote-show = Vis fotnote
footnote-hide = Skjul fotnote
description-more-information = meir informasjon

## Controls

slider-previous = Førre
slider-next = Neste
keyboard-open = Opne tastaturet
keyboard-close = Lukk tastaturet
choice-input-remove-choice = Fjern { $choice }
matrix-remove-row = Fjern rad
matrix-add-row = Legg til rad
matrix-remove-column = Fjern kolonne
matrix-add-column = Legg til kolonne
subset-add-remove-points = Legg til / fjern punkt
subset-toggle-points-intervals = Veksle mellom punkt og intervall
subset-move-points = Flytt punkt
subset-clear = Tøm
orbital-add-row = Legg til rad
orbital-remove-row = Fjern rad
orbital-add-box = Legg til rute
orbital-remove-box = Fjern rute
orbital-add-up-arrow = Legg til pil opp
orbital-add-down-arrow = Legg til pil ned
orbital-remove-arrow = Fjern pil
orbital-row-label = Merkelapp for rad { $row }
pretzel-answer = Svar

## Math input

math-input-preview-region = førehandsvising av matematisk uttrykk
math-input-preview = Førehandsvising
math-input-invalid-expression = Ugyldig uttrykk:

## Document status

viewer-initializing = Startar opp…

## Errors

error-heading = Feil
error-found-at =
    { $span ->
        [line] Funne på linje { $startLine }.
       *[lines] Funne på linjene { $startLine }–{ $endLine }.
    }
document-contains-errors = Dette dokumentet inneheld feil!
diagnostic-heading-error = Feil
diagnostic-heading-warning = Åtvaring
diagnostic-heading-information = Informasjon
diagnostic-heading-hint = Tips
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Brot på WCAG AA-krav til tilgjenge
accessibility-heading-level-2 = Merknad om tilgjenge
something-went-wrong = Noko gjekk gale.
renderer-load-failed = ein gjengivingsmodul kunne ikkje lastast. Last inn sida på nytt.
core-start-failed = Dette dokumentet kunne ikkje startast. Last inn sida på nytt.
core-start-failed-busy = Dette dokumentet kunne ikkje startast. Fleire dokument vart starta samtidig, og det kan ta lengre tid på ei treg eining. Å laste sida på nytt kan hjelpe når dei andre dokumenta er ferdige.
core-start-failed-retry = Dette dokumentet kunne ikkje startast.
core-start-failed-busy-retry = Dette dokumentet kunne ikkje startast. Fleire dokument vart starta samtidig, og det kan ta lengre tid på ei treg eining.
core-start-retry = Prøv igjen
saved-state-unavailable = Det lagra arbeidet ditt kunne ikkje hentast.
