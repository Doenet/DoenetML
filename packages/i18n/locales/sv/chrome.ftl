# Swedish viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Swedish counts in two plural categories, but several of the nouns counted
# here take no plural ending at all: «försök» and «svar» are neuter and are
# spelled the same in both numbers. Where that is the only difference English
# draws, the select is dropped rather than written out twice identically.
#
# Register: impersonal, and an instruction is the imperative («Ladda om
# sidan»), which is what Swedish software uses.


## Answer submission

answer-checking = Kontrollerar…
answer-submitting = Skickar…
answer-checking-status = Kontrollerar svar
answer-submitting-status = Skickar svar
answer-correct = Rätt
answer-incorrect = Fel
answer-response-saved = Svar sparat
answer-percent-credit = { $percent } % poäng
answer-percent-correct = { $percent } % rätt
answer-percent-short = { $percent } %
max-credit-available = Högsta möjliga poäng: { $percent } %
attempts-remaining =
    { $count ->
        [0] inga försök kvar
       *[other] { $count } försök kvar
    }
validation-correct = (Rätt)
validation-incorrect = (Fel)
validation-partially-correct = (Delvis rätt)
answer-show-responses = Visa { $count } svar till { $answerId }

## Disclosure panels

feedback-heading = Återkoppling
collapsible-click-to-open = (klicka för att öppna)
collapsible-click-to-close = (klicka för att stänga)
collapsible-initializing = Initierar…
footnote-show = Visa fotnot
footnote-hide = Dölj fotnot
description-more-information = mer information

## Controls

slider-previous = Föreg.
slider-next = Nästa
keyboard-open = Öppna tangentbordet
keyboard-close = Stäng tangentbordet
choice-input-remove-choice = Ta bort { $choice }
matrix-remove-row = Ta bort rad
matrix-add-row = Lägg till rad
matrix-remove-column = Ta bort kolumn
matrix-add-column = Lägg till kolumn
subset-add-remove-points = Lägg till/ta bort punkter
subset-toggle-points-intervals = Växla mellan punkter och intervall
subset-move-points = Flytta punkter
subset-clear = Rensa
orbital-add-row = Lägg till rad
orbital-remove-row = Ta bort rad
orbital-add-box = Lägg till ruta
orbital-remove-box = Ta bort ruta
orbital-add-up-arrow = Lägg till uppåtpil
orbital-add-down-arrow = Lägg till nedåtpil
orbital-remove-arrow = Ta bort pil
orbital-row-label = Etikett för rad { $row }
pretzel-answer = Svar

## Math input

math-input-preview-region = förhandsgranskning av matematiskt uttryck
math-input-preview = Förhandsgranskning
math-input-invalid-expression = Ogiltigt uttryck:

## Document status

viewer-initializing = Initierar…

## Errors

error-heading = Fel
error-found-at =
    { $span ->
        [line] Hittades på rad { $startLine }.
       *[lines] Hittades på raderna { $startLine }–{ $endLine }.
    }
document-contains-errors = Det här dokumentet innehåller fel!
diagnostic-heading-error = Fel
diagnostic-heading-warning = Varning
diagnostic-heading-information = Information
diagnostic-heading-hint = Tips
accessibility-heading-level-1 = Tillgänglighetsbrist enligt WCAG AA
accessibility-heading-level-2 = Tillgänglighetsanmärkning
something-went-wrong = Något gick fel.
renderer-load-failed = en renderare kunde inte laddas. Ladda om sidan.
core-start-failed = Dokumentvisaren kunde inte startas. Ladda om sidan.
