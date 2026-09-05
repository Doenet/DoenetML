# Danish viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Danish counts in two plural categories, but several of the nouns counted here
# take no plural ending: «forsøg» and «svar» are neuter and are spelled the
# same in both numbers. Where that is the only difference English draws, the
# select is dropped rather than written out twice identically.
#
# Register: impersonal, and an instruction is the imperative («Genindlæs
# siden»), which is what Danish software uses.


## Answer submission

answer-checking = Kontrollerer…
answer-submitting = Sender…
answer-checking-status = Kontrollerer svar
answer-submitting-status = Sender svar
answer-correct = Rigtigt
answer-incorrect = Forkert
answer-response-saved = Svar gemt
answer-percent-credit = { $percent } % point
answer-percent-correct = { $percent } % rigtigt
answer-percent-short = { $percent } %
max-credit-available = Højeste mulige point: { $percent } %
attempts-remaining =
    { $count ->
        [0] ingen forsøg tilbage
       *[other] { $count } forsøg tilbage
    }
validation-correct = (Rigtigt)
validation-incorrect = (Forkert)
validation-partially-correct = (Delvist rigtigt)
answer-show-responses = Vis { $count } svar til { $answerId }

## Disclosure panels

feedback-heading = Feedback
collapsible-click-to-open = (klik for at åbne)
collapsible-click-to-close = (klik for at lukke)
collapsible-initializing = Initialiserer…
footnote-show = Vis fodnote
footnote-hide = Skjul fodnote
description-more-information = flere oplysninger

## Controls

slider-previous = Forrige
slider-next = Næste
keyboard-open = Åbn tastaturet
keyboard-close = Luk tastaturet
choice-input-remove-choice = Fjern { $choice }
matrix-remove-row = Fjern række
matrix-add-row = Tilføj række
matrix-remove-column = Fjern kolonne
matrix-add-column = Tilføj kolonne
subset-add-remove-points = Tilføj/fjern punkter
subset-toggle-points-intervals = Skift mellem punkter og intervaller
subset-move-points = Flyt punkter
subset-clear = Ryd
orbital-add-row = Tilføj række
orbital-remove-row = Fjern række
orbital-add-box = Tilføj felt
orbital-remove-box = Fjern felt
orbital-add-up-arrow = Tilføj pil opad
orbital-add-down-arrow = Tilføj pil nedad
orbital-remove-arrow = Fjern pil
orbital-row-label = Mærkat til række { $row }
pretzel-answer = Svar

## Math input

math-input-preview-region = forhåndsvisning af matematisk udtryk
math-input-preview = Forhåndsvisning
math-input-invalid-expression = Ugyldigt udtryk:

## Document status

viewer-initializing = Initialiserer…

## Errors

error-heading = Fejl
error-found-at =
    { $span ->
        [line] Fundet på linje { $startLine }.
       *[lines] Fundet på linjerne { $startLine }–{ $endLine }.
    }
document-contains-errors = Dette dokument indeholder fejl!
diagnostic-heading-error = Fejl
diagnostic-heading-warning = Advarsel
diagnostic-heading-information = Information
diagnostic-heading-hint = Tip
accessibility-heading-level-1 = Tilgængelighedsbrud efter WCAG AA
accessibility-heading-level-2 = Tilgængelighedsbemærkning
something-went-wrong = Noget gik galt.
renderer-load-failed = et gengivelsesmodul kunne ikke indlæses. Genindlæs siden.
core-start-failed = Dokumentfremviseren kunne ikke startes. Genindlæs siden.
