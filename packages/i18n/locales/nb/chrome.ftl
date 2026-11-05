# Norwegian Bokmål viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Norwegian counts in two plural categories, but several of the nouns counted
# here take no plural ending: «forsøk» and «svar» are neuter and are spelled
# the same in both numbers. Where that is the only difference English draws,
# the select is dropped rather than written out twice identically.
#
# Register: impersonal, and an instruction is the imperative («Last inn siden
# på nytt»), which is what Norwegian software uses.


## Answer submission

answer-checking = Sjekker…
answer-submitting = Sender…
answer-checking-status = Sjekker svar
answer-submitting-status = Sender svar
answer-correct = Riktig
answer-incorrect = Feil
answer-response-saved = Svar lagret
answer-percent-credit = { $percent } % poeng
answer-percent-correct = { $percent } % riktig
answer-percent-short = { $percent } %
max-credit-available = Høyeste oppnåelige poengsum: { $percent } %
attempts-remaining =
    { $count ->
        [0] ingen forsøk igjen
       *[other] { $count } forsøk igjen
    }
validation-correct = (Riktig)
validation-incorrect = (Feil)
validation-partially-correct = (Delvis riktig)
answer-show-responses = Vis { $count } svar til { $answerId }

## Disclosure panels

feedback-heading = Tilbakemelding
collapsible-click-to-open = (klikk for å åpne)
collapsible-click-to-close = (klikk for å lukke)
collapsible-initializing = Initialiserer…
footnote-show = Vis fotnote
footnote-hide = Skjul fotnote
description-more-information = mer informasjon

## Controls

slider-previous = Forrige
slider-next = Neste
keyboard-open = Åpne tastaturet
keyboard-close = Lukk tastaturet
choice-input-remove-choice = Fjern { $choice }
matrix-remove-row = Fjern rad
matrix-add-row = Legg til rad
matrix-remove-column = Fjern kolonne
matrix-add-column = Legg til kolonne
subset-add-remove-points = Legg til / fjern punkter
subset-toggle-points-intervals = Veksle mellom punkter og intervaller
subset-move-points = Flytt punkter
subset-clear = Tøm
orbital-add-row = Legg til rad
orbital-remove-row = Fjern rad
orbital-add-box = Legg til rute
orbital-remove-box = Fjern rute
orbital-add-up-arrow = Legg til pil opp
orbital-add-down-arrow = Legg til pil ned
orbital-remove-arrow = Fjern pil
orbital-row-label = Etikett for rad { $row }
pretzel-answer = Svar

## Math input

math-input-preview-region = forhåndsvisning av matematisk uttrykk
math-input-preview = Forhåndsvisning
math-input-invalid-expression = Ugyldig uttrykk:

## Document status

viewer-initializing = Initialiserer…

## Errors

error-heading = Feil
error-found-at =
    { $span ->
        [line] Funnet på linje { $startLine }.
       *[lines] Funnet på linjene { $startLine }–{ $endLine }.
    }
document-contains-errors = Dette dokumentet inneholder feil!
diagnostic-heading-error = Feil
diagnostic-heading-warning = Advarsel
diagnostic-heading-information = Informasjon
diagnostic-heading-hint = Tips
accessibility-heading-level-1 = Tilgjengelighetsbrudd etter WCAG AA
accessibility-heading-level-2 = Tilgjengelighetsmerknad
something-went-wrong = Noe gikk galt.
renderer-load-failed = en gjengivelsesmodul kunne ikke lastes. Last inn siden på nytt.
core-start-failed = Dokumentviseren kunne ikke startes. Last inn siden på nytt.
