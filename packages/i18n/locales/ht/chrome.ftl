# Haitian Creole viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the official orthography of 1979, which is the one Haitian schools
# and the state use.
#
# Haitian Creole inflects nothing. A noun has one form for one and for many —
# the plural is the postposed «yo», and a count in front of the noun does the
# work on its own — so a `{ $count -> … }` here has no second form to select
# and every one of them is dropped, keeping only the `[0]` wording that names
# none, which is a different sentence rather than a different form. That is not
# an unfinished catalog: it is the whole of Creole's nominal morphology, and the
# comment at each site says so.
#
# There is no French spacing before `:`, `?` or `!` — Creole punctuates as
# English does, which is one of the places its orthography deliberately parted
# from French.


## Answer submission

answer-checking = Ap tcheke…
answer-submitting = Ap voye…
answer-checking-status = Ap tcheke repons la
answer-submitting-status = Ap voye repons la
answer-correct = Kòrèk
answer-incorrect = Pa kòrèk
answer-response-saved = Repons la anrejistre
answer-percent-credit = { $percent }% kredi
answer-percent-correct = { $percent }% kòrèk
answer-percent-short = { $percent } %
max-credit-available = Kredi maksimòm disponib: { $percent }%
# No select: «esè» is the same word for one and for many, so both categories
# would render the same string. The count still arrives and is still formatted;
# only the branching is gone. `[0]` stays, because "none left" is its own
# sentence and not a form of this one.
attempts-remaining =
    { $count ->
        [0] pa gen esè ki rete
       *[other] { $count } esè ki rete
    }
validation-correct = (Kòrèk)
validation-incorrect = (Pa kòrèk)
validation-partially-correct = (Kòrèk an pati)
# No select, for the reason given above.
answer-show-responses = Montre { $count } repons pou { $answerId }

## Disclosure panels

feedback-heading = Fidbak
collapsible-click-to-open = (klike pou ouvri)
collapsible-click-to-close = (klike pou fèmen)
collapsible-initializing = Ap inisyalize…
footnote-show = Montre nòt anba paj la
footnote-hide = Kache nòt anba paj la
description-more-information = plis enfòmasyon

## Controls

slider-previous = Anvan
slider-next = Apre
keyboard-open = Ouvri klavye a
keyboard-close = Fèmen klavye a
choice-input-remove-choice = Retire { $choice }
matrix-remove-row = Retire yon ranje
matrix-add-row = Ajoute yon ranje
matrix-remove-column = Retire yon kolòn
matrix-add-column = Ajoute yon kolòn
subset-add-remove-points = Ajoute/Retire pwen
subset-toggle-points-intervals = Chanje ant pwen ak entèval
subset-move-points = Deplase pwen
subset-clear = Efase
orbital-add-row = Ajoute yon ranje
orbital-remove-row = Retire yon ranje
orbital-add-box = Ajoute yon bwat
orbital-remove-box = Retire yon bwat
orbital-add-up-arrow = Ajoute yon flèch anwo
orbital-add-down-arrow = Ajoute yon flèch anba
orbital-remove-arrow = Retire yon flèch
orbital-row-label = Etikèt pou ranje { $row }
pretzel-answer = Repons

## Math input

math-input-preview-region = apèsi ekspresyon matematik la
math-input-preview = Apèsi
math-input-invalid-expression = Ekspresyon ki pa valab:

## Document status

viewer-initializing = Ap inisyalize…

## Errors

error-heading = Erè
error-found-at =
    { $span ->
        [line] Yo jwenn li nan liy { $startLine }.
       *[lines] Yo jwenn li nan liy { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokiman sa a gen erè ladan l!
diagnostic-heading-error = Erè
diagnostic-heading-warning = Avètisman
diagnostic-heading-information = Enfo
diagnostic-heading-hint = Endikasyon
accessibility-heading-level-1 = Vyolasyon aksesibilite WCAG AA
accessibility-heading-level-2 = Alèt aksesibilite
something-went-wrong = Gen yon bagay ki pa mache.
renderer-load-failed = yon randè pa t rive chaje. Tanpri rechaje paj la.
core-start-failed = Vizyonè dokiman an pa t kapab demare. Tanpri rechaje paj la.
