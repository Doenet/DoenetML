# Afrikaans viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Afrikaans has two plural categories, as English does, so the counted messages
# keep both branches.


## Answer submission

answer-checking = Kontroleer tans...
answer-submitting = Dien tans in...
answer-checking-status = Kontroleer antwoord
answer-submitting-status = Dien antwoord in
answer-correct = Korrek
answer-incorrect = Verkeerd
answer-response-saved = Antwoord Gestoor
answer-percent-credit = { $percent }% Krediet
answer-percent-correct = { $percent }% Korrek
answer-percent-short = { $percent } %
max-credit-available = Maksimum krediet beskikbaar: { $percent }%
attempts-remaining =
    { $count ->
        [0] geen pogings oor nie
        [one] { $count } poging oor
       *[other] { $count } pogings oor
    }
validation-correct = (Korrek)
validation-incorrect = (Verkeerd)
validation-partially-correct = (Gedeeltelik korrek)
answer-show-responses =
    { $count ->
        [one] Wys { $count } antwoord op { $answerId }
       *[other] Wys { $count } antwoorde op { $answerId }
    }

## Disclosure panels

feedback-heading = Terugvoer
collapsible-click-to-open = (klik om oop te maak)
collapsible-click-to-close = (klik om toe te maak)
collapsible-initializing = Begin tans...
footnote-show = Wys voetnoot
footnote-hide = Versteek voetnoot
description-more-information = meer inligting

## Controls

slider-previous = Vorige
slider-next = Volgende
keyboard-open = Maak Sleutelbord Oop
keyboard-close = Maak Sleutelbord Toe
choice-input-remove-choice = Verwyder { $choice }
matrix-remove-row = Verwyder ry
matrix-add-row = Voeg ry by
matrix-remove-column = Verwyder kolom
matrix-add-column = Voeg kolom by
subset-add-remove-points = Voeg punte by / verwyder punte
subset-toggle-points-intervals = Wissel tussen punte en intervalle
subset-move-points = Skuif Punte
subset-clear = Maak Skoon
# A `box` here is one orbital, drawn as a square: blokkie.
orbital-add-row = Voeg Ry By
orbital-remove-row = Verwyder Ry
orbital-add-box = Voeg Blokkie By
orbital-remove-box = Verwyder Blokkie
orbital-add-up-arrow = Voeg Oppyl By
orbital-add-down-arrow = Voeg Afpyl By
orbital-remove-arrow = Verwyder Pyl
orbital-row-label = Etiket vir ry { $row }
pretzel-answer = Antwoord

## Math input

math-input-preview-region = voorskou van wiskundige uitdrukking
math-input-preview = Voorskou
math-input-invalid-expression = Ongeldige uitdrukking:

## Document status

viewer-initializing = Begin tans...

## Errors

error-heading = Fout
error-found-at =
    { $span ->
        [line] Gevind op reël { $startLine }.
       *[lines] Gevind op reëls { $startLine }–{ $endLine }.
    }
document-contains-errors = Hierdie dokument bevat foute!
diagnostic-heading-error = Fout
diagnostic-heading-warning = Waarskuwing
diagnostic-heading-information = Inligting
diagnostic-heading-hint = Wenk
accessibility-heading-level-1 = WCAG AA-toeganklikheidsoortreding
accessibility-heading-level-2 = Toeganklikheidswaarskuwing
something-went-wrong = Iets het verkeerd geloop.
renderer-load-failed = 'n weergeër kon nie laai nie. Laai die bladsy asseblief weer.
core-start-failed = Die dokumentkyker kon nie begin nie. Laai die bladsy asseblief weer.
