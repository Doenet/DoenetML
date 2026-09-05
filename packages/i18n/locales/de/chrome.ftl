# German viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: impersonal throughout — infinitives and bare nouns, never a `du`
# or `Sie` verb form. The two "reload the page" messages are the only ones
# that ask the reader to act, and they keep the infinitive too, softened with
# `bitte`: „Bitte die Seite neu laden“. That is how German signage and
# software give an instruction without choosing a pronoun.


## Answer submission

answer-checking = Wird geprüft …
answer-submitting = Wird gesendet …
answer-checking-status = Antwort wird geprüft
answer-submitting-status = Antwort wird gesendet
answer-correct = Richtig
answer-incorrect = Falsch
answer-response-saved = Antwort gespeichert
answer-percent-credit = { $percent } % Anrechnung
answer-percent-correct = { $percent } % richtig
answer-percent-short = { $percent } %
max-credit-available = Höchstens erreichbar: { $percent } %
attempts-remaining =
    { $count ->
        [0] keine Versuche übrig
        [one] noch { $count } Versuch
       *[other] noch { $count } Versuche
    }
validation-correct = (Richtig)
validation-incorrect = (Falsch)
validation-partially-correct = (Teilweise richtig)
# `Anzeigen` is the infinitive, per the register note above.
answer-show-responses =
    { $count ->
        [one] { $count } Antwort auf { $answerId } anzeigen
       *[other] { $count } Antworten auf { $answerId } anzeigen
    }

## Disclosure panels

feedback-heading = Rückmeldung
collapsible-click-to-open = (zum Öffnen klicken)
collapsible-click-to-close = (zum Schließen klicken)
collapsible-initializing = Wird initialisiert …
footnote-show = Fußnote anzeigen
footnote-hide = Fußnote ausblenden
description-more-information = weitere Informationen

## Controls

slider-previous = Zurück
slider-next = Weiter
keyboard-open = Tastatur öffnen
keyboard-close = Tastatur schließen
choice-input-remove-choice = { $choice } entfernen
matrix-remove-row = Zeile entfernen
matrix-add-row = Zeile hinzufügen
matrix-remove-column = Spalte entfernen
matrix-add-column = Spalte hinzufügen
subset-add-remove-points = Punkte hinzufügen/entfernen
subset-toggle-points-intervals = Zwischen Punkten und Intervallen wechseln
subset-move-points = Punkte verschieben
subset-clear = Leeren
# A `box` here is one orbital, drawn as a square: `Kästchen`.
orbital-add-row = Zeile hinzufügen
orbital-remove-row = Zeile entfernen
orbital-add-box = Kästchen hinzufügen
orbital-remove-box = Kästchen entfernen
orbital-add-up-arrow = Pfeil nach oben hinzufügen
orbital-add-down-arrow = Pfeil nach unten hinzufügen
orbital-remove-arrow = Pfeil entfernen
orbital-row-label = Beschriftung für Zeile { $row }
pretzel-answer = Antwort

## Math input

math-input-preview-region = Vorschau des mathematischen Ausdrucks
math-input-preview = Vorschau
math-input-invalid-expression = Ungültiger Ausdruck:

## Document status

viewer-initializing = Wird initialisiert …

## Errors

error-heading = Fehler
error-found-at =
    { $span ->
        [line] Gefunden in Zeile { $startLine }.
       *[lines] Gefunden in den Zeilen { $startLine }–{ $endLine }.
    }
document-contains-errors = Dieses Dokument enthält Fehler!
diagnostic-heading-error = Fehler
diagnostic-heading-warning = Warnung
diagnostic-heading-information = Info
diagnostic-heading-hint = Hinweis
accessibility-heading-level-1 = Verstoß gegen WCAG AA (Barrierefreiheit)
accessibility-heading-level-2 = Hinweis zur Barrierefreiheit
something-went-wrong = Etwas ist schiefgelaufen.
renderer-load-failed = eine Anzeigekomponente konnte nicht geladen werden. Bitte die Seite neu laden.
core-start-failed = Die Dokumentanzeige konnte nicht gestartet werden. Bitte die Seite neu laden.
