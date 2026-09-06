# Low German viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Northern Low Saxon throughout; see `content.ftl`'s header.
#
# Two plural categories, `one` and `other`, and `one` does not catch zero —
# which is why the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Warrt nakeken…
answer-submitting = Warrt afschickt…
answer-checking-status = Antwoort warrt nakeken
answer-submitting-status = Antwoort warrt afschickt
answer-correct = Richtig
answer-incorrect = Verkehrt
answer-response-saved = Antwoort sekert
answer-percent-credit = { $percent }% Pünkte
answer-percent-correct = { $percent }% richtig
answer-percent-short = { $percent } %
max-credit-available = Hööchst mööglich Pünkte: { $percent }%
attempts-remaining =
    { $count ->
        [0] keen Versöök mehr över
        [one] noch { $count } Versöök över
       *[other] noch { $count } Versöken över
    }
validation-correct = (Richtig)
validation-incorrect = (Verkehrt)
validation-partially-correct = (Deelwies richtig)
answer-show-responses =
    { $count ->
        [one] { $count } Antwoort op { $answerId } wiesen
       *[other] { $count } Antwoorden op { $answerId } wiesen
    }

## Disclosure panels

feedback-heading = Torüchmellen
collapsible-click-to-open = (klick to’n Opmaken)
collapsible-click-to-close = (klick to’n Tomaken)
collapsible-initializing = Start…
footnote-show = Footnoot wiesen
footnote-hide = Footnoot versteken
description-more-information = mehr Informatschoon

## Controls

slider-previous = Torüch
slider-next = Wieder
keyboard-open = Tastatuur opmaken
keyboard-close = Tastatuur tomaken
choice-input-remove-choice = { $choice } wegnehmen
matrix-remove-row = Reeg wegnehmen
matrix-add-row = Reeg tofögen
matrix-remove-column = Striep wegnehmen
matrix-add-column = Striep tofögen
subset-add-remove-points = Pünkte tofögen/wegnehmen
subset-toggle-points-intervals = Twischen Pünkte un Intervallen wesseln
subset-move-points = Pünkte verschuven
subset-clear = Leddig maken
orbital-add-row = Reeg tofögen
orbital-remove-row = Reeg wegnehmen
orbital-add-box = Kasten tofögen
orbital-remove-box = Kasten wegnehmen
orbital-add-up-arrow = Piel na baven tofögen
orbital-add-down-arrow = Piel na nerrn tofögen
orbital-remove-arrow = Piel wegnehmen
orbital-row-label = Beteken för Reeg { $row }
pretzel-answer = Antwoort

## Math input

math-input-preview-region = Vöransicht vun’n mathemaatschen Utdruck
math-input-preview = Vöransicht
math-input-invalid-expression = Ungülltig Utdruck:

## Document status

viewer-initializing = Start…

## Errors

error-heading = Fehler
error-found-at =
    { $span ->
        [line] Funnen in Reeg { $startLine }.
       *[lines] Funnen in de Regen { $startLine }–{ $endLine }.
    }
document-contains-errors = In dit Dokument sünd Fehlers!
diagnostic-heading-error = Fehler
diagnostic-heading-warning = Wohrschau
diagnostic-heading-information = Info
diagnostic-heading-hint = Henwies
accessibility-heading-level-1 = Verstoot gegen de Togänglichkeit na WCAG AA
accessibility-heading-level-2 = Wohrschau to de Togänglichkeit
something-went-wrong = Dor is wat schiefgahn.
renderer-load-failed = en Modul för dat Wiesen kunn nich laadt warrn. Laad de Siet nieg.
core-start-failed = De Dokumentkieker kunn nich start warrn. Laad de Siet nieg.
