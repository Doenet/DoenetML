# Luxembourgish viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Two plural categories, `one` and `other`, and `one` does not catch zero —
# which is why the wording for none is spelled out in `[0]`.
#
# Register: the polite plural imperative, «Luet d'Säit nei», which is what a
# Luxembourgish interface says to a reader it has not met.


## Answer submission

answer-checking = Iwwerpréiwen…
answer-submitting = Schécken…
answer-checking-status = Äntwert gëtt iwwerpréift
answer-submitting-status = Äntwert gëtt geschéckt
answer-correct = Richteg
answer-incorrect = Falsch
answer-response-saved = Äntwert gespäichert
answer-percent-credit = { $percent }% Punkten
answer-percent-correct = { $percent }% richteg
answer-percent-short = { $percent } %
max-credit-available = Maximal méiglech Punkten: { $percent }%
attempts-remaining =
    { $count ->
        [0] keng Versich méi iwwreg
        [one] nach { $count } Versuch iwwreg
       *[other] nach { $count } Versich iwwreg
    }
validation-correct = (Richteg)
validation-incorrect = (Falsch)
validation-partially-correct = (Deelweis richteg)
answer-show-responses =
    { $count ->
        [one] { $count } Äntwert op { $answerId } weisen
       *[other] { $count } Äntwerten op { $answerId } weisen
    }

## Disclosure panels

feedback-heading = Réckmeldung
collapsible-click-to-open = (klickt fir opzemaachen)
collapsible-click-to-close = (klickt fir zouzemaachen)
collapsible-initializing = Start…
footnote-show = Foussnout weisen
footnote-hide = Foussnout verstoppen
description-more-information = méi Informatioun

## Controls

slider-previous = Zréck
slider-next = Weider
keyboard-open = Tastatur opmaachen
keyboard-close = Tastatur zoumaachen
choice-input-remove-choice = { $choice } ewechhuelen
matrix-remove-row = Zeil ewechhuelen
matrix-add-row = Zeil derbäisetzen
matrix-remove-column = Kolonn ewechhuelen
matrix-add-column = Kolonn derbäisetzen
subset-add-remove-points = Punkten derbäisetzen/ewechhuelen
subset-toggle-points-intervals = Tëscht Punkten an Intervaller wiesselen
subset-move-points = Punkte réckelen
subset-clear = Läschen
orbital-add-row = Zeil derbäisetzen
orbital-remove-row = Zeil ewechhuelen
orbital-add-box = Këscht derbäisetzen
orbital-remove-box = Këscht ewechhuelen
orbital-add-up-arrow = Pfeil no uewe derbäisetzen
orbital-add-down-arrow = Pfeil no ënne derbäisetzen
orbital-remove-arrow = Pfeil ewechhuelen
orbital-row-label = Bezeechnung fir Zeil { $row }
pretzel-answer = Äntwert

## Math input

math-input-preview-region = Virschau vum mathemateschen Ausdrock
math-input-preview = Virschau
math-input-invalid-expression = Ongëltegen Ausdrock:

## Document status

viewer-initializing = Start…

## Errors

error-heading = Feeler
error-found-at =
    { $span ->
        [line] Fonnt op der Linn { $startLine }.
       *[lines] Fonnt op de Linnen { $startLine }–{ $endLine }.
    }
document-contains-errors = Dëst Dokument enthält Feeler!
diagnostic-heading-error = Feeler
diagnostic-heading-warning = Warnung
diagnostic-heading-information = Info
diagnostic-heading-hint = Hiweis
accessibility-heading-level-1 = Verstouss géint d'Accessibilitéit no WCAG AA
accessibility-heading-level-2 = Hiweis zur Accessibilitéit
something-went-wrong = Eppes ass schifgaangen.
renderer-load-failed = e Modul fir d'Uweise konnt net gelueden ginn. Luet d'Säit nei.
core-start-failed = De Visualiséierer vum Dokument konnt net gestart ginn. Luet d'Säit nei.
