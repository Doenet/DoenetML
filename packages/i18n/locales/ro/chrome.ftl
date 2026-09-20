# Romanian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Romanian counts in three plural categories, and the third one is not about
# the noun at all: above nineteen, a counted noun is introduced by «de» — «20
# de încercări» against «19 încercări». That is exactly what CLDR's `few` and
# `other` separate here, so every `{ $count -> … }` below has three branches
# and the third one carries the preposition.
#
# Register: the plural of politeness, which is what Romanian software uses.


## Answer submission

answer-checking = Se verifică…
answer-submitting = Se trimite…
answer-checking-status = Se verifică răspunsul
answer-submitting-status = Se trimite răspunsul
answer-correct = Corect
answer-incorrect = Incorect
answer-response-saved = Răspuns salvat
answer-percent-credit = { $percent }% punctaj
answer-percent-correct = { $percent }% corect
answer-percent-short = { $percent } %
max-credit-available = Punctaj maxim disponibil: { $percent }%
attempts-remaining =
    { $count ->
        [0] nicio încercare rămasă
        [one] a rămas { $count } încercare
        [few] au rămas { $count } încercări
       *[other] au rămas { $count } de încercări
    }
validation-correct = (Corect)
validation-incorrect = (Incorect)
validation-partially-correct = (Parțial corect)
answer-show-responses =
    { $count ->
        [one] Afișează { $count } răspuns la { $answerId }
        [few] Afișează { $count } răspunsuri la { $answerId }
       *[other] Afișează { $count } de răspunsuri la { $answerId }
    }

## Disclosure panels

feedback-heading = Feedback
collapsible-click-to-open = (clic pentru a deschide)
collapsible-click-to-close = (clic pentru a închide)
collapsible-initializing = Se inițializează…
footnote-show = Afișează nota de subsol
footnote-hide = Ascunde nota de subsol
description-more-information = mai multe informații

## Controls

slider-previous = Înapoi
slider-next = Înainte
keyboard-open = Deschide tastatura
keyboard-close = Închide tastatura
choice-input-remove-choice = Elimină { $choice }
matrix-remove-row = Elimină linia
matrix-add-row = Adaugă o linie
matrix-remove-column = Elimină coloana
matrix-add-column = Adaugă o coloană
subset-add-remove-points = Adaugă/elimină puncte
subset-toggle-points-intervals = Comută puncte și intervale
subset-move-points = Mută puncte
subset-clear = Șterge
orbital-add-row = Adaugă un rând
orbital-remove-row = Elimină rândul
orbital-add-box = Adaugă o căsuță
orbital-remove-box = Elimină căsuța
orbital-add-up-arrow = Adaugă o săgeată în sus
orbital-add-down-arrow = Adaugă o săgeată în jos
orbital-remove-arrow = Elimină săgeata
orbital-row-label = Etichetă pentru rândul { $row }
pretzel-answer = Răspuns

## Math input

math-input-preview-region = previzualizare a expresiei matematice
math-input-preview = Previzualizare
math-input-invalid-expression = Expresie nevalidă:

## Document status

viewer-initializing = Se inițializează…

## Errors

error-heading = Eroare
error-found-at =
    { $span ->
        [line] Găsit la linia { $startLine }.
       *[lines] Găsit la liniile { $startLine }–{ $endLine }.
    }
document-contains-errors = Acest document conține erori!
diagnostic-heading-error = Eroare
diagnostic-heading-warning = Avertisment
diagnostic-heading-information = Informație
diagnostic-heading-hint = Indiciu
accessibility-heading-level-1 = Încălcare a accesibilității WCAG AA
accessibility-heading-level-2 = Alertă de accesibilitate
something-went-wrong = Ceva nu a mers bine.
renderer-load-failed = un modul de randare nu a putut fi încărcat. Reîncărcați pagina.
core-start-failed = Vizualizatorul de documente nu a putut fi pornit. Reîncărcați pagina.
