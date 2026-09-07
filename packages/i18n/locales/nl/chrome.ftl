# Dutch viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: impersonal throughout — infinitives and bare nouns, never a `je`
# or `u` verb form. Where the reader is asked to act — the click-to-open pair
# and the two "reload the page" messages — the bare imperative does it
# (`klik`, `laad`), which Dutch leaves unmarked for `je` against `u`, so even
# there the file picks neither.


## Answer submission

answer-checking = Controleren...
answer-submitting = Verzenden...
answer-checking-status = Antwoord wordt gecontroleerd
answer-submitting-status = Antwoord wordt verzonden
answer-correct = Goed
answer-incorrect = Fout
answer-response-saved = Antwoord opgeslagen
answer-percent-credit = { $percent }% punten
answer-percent-correct = { $percent }% goed
answer-percent-short = { $percent } %
max-credit-available = Maximaal haalbaar: { $percent }%
attempts-remaining =
    { $count ->
        [0] geen pogingen meer
        [one] nog { $count } poging
       *[other] nog { $count } pogingen
    }
validation-correct = (Goed)
validation-incorrect = (Fout)
validation-partially-correct = (Gedeeltelijk goed)
# `Tonen` is the infinitive, per the register note above.
answer-show-responses =
    { $count ->
        [one] { $count } antwoord op { $answerId } tonen
       *[other] { $count } antwoorden op { $answerId } tonen
    }

## Disclosure panels

feedback-heading = Feedback
collapsible-click-to-open = (klik om te openen)
collapsible-click-to-close = (klik om te sluiten)
collapsible-initializing = Initialiseren...
footnote-show = Voetnoot tonen
footnote-hide = Voetnoot verbergen
description-more-information = meer informatie

## Controls

slider-previous = Vorige
slider-next = Volgende
keyboard-open = Toetsenbord openen
keyboard-close = Toetsenbord sluiten
choice-input-remove-choice = { $choice } verwijderen
matrix-remove-row = Rij verwijderen
matrix-add-row = Rij toevoegen
matrix-remove-column = Kolom verwijderen
matrix-add-column = Kolom toevoegen
subset-add-remove-points = Punten toevoegen/verwijderen
subset-toggle-points-intervals = Wisselen tussen punten en intervallen
subset-move-points = Punten verplaatsen
subset-clear = Wissen
# A `box` here is one orbital, drawn as a square: `vakje`.
orbital-add-row = Rij toevoegen
orbital-remove-row = Rij verwijderen
orbital-add-box = Vakje toevoegen
orbital-remove-box = Vakje verwijderen
orbital-add-up-arrow = Pijl omhoog toevoegen
orbital-add-down-arrow = Pijl omlaag toevoegen
orbital-remove-arrow = Pijl verwijderen
orbital-row-label = Label voor rij { $row }
pretzel-answer = Antwoord

## Math input

math-input-preview-region = voorbeeld van de wiskundige uitdrukking
math-input-preview = Voorbeeld
math-input-invalid-expression = Ongeldige uitdrukking:

## Document status

viewer-initializing = Initialiseren...

## Errors

error-heading = Fout
error-found-at =
    { $span ->
        [line] Gevonden op regel { $startLine }.
       *[lines] Gevonden op de regels { $startLine }–{ $endLine }.
    }
document-contains-errors = Dit document bevat fouten!
diagnostic-heading-error = Fout
diagnostic-heading-warning = Waarschuwing
diagnostic-heading-information = Info
diagnostic-heading-hint = Tip
accessibility-heading-level-1 = Schending van WCAG AA-toegankelijkheid
accessibility-heading-level-2 = Toegankelijkheidsmelding
something-went-wrong = Er is iets misgegaan.
renderer-load-failed = een weergavecomponent kon niet worden geladen. Laad de pagina opnieuw.
core-start-failed = De documentweergave kon niet worden gestart. Laad de pagina opnieuw.
