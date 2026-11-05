# Slovak viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Slovak counts in `one`, `few` and `other` for whole numbers; `many` is the
# fraction category and never applies to a count of attempts or responses, so
# it is not written out below. `other` takes the genitive plural — «5 pokusov».
#
# Register: impersonal. An instruction is the infinitive («Je potrebné znova
# načítať stránku»), which avoids choosing between ty and vy.
#
# A percent sign is preceded by a space when it is read as a noun («50 %
# hodnotenia»), which is every use of it here.


## Answer submission

answer-checking = Prebieha kontrola…
answer-submitting = Prebieha odosielanie…
answer-checking-status = Kontrola odpovede
answer-submitting-status = Odosielanie odpovede
answer-correct = Správne
answer-incorrect = Nesprávne
answer-response-saved = Odpoveď uložená
answer-percent-credit = { $percent } % hodnotenia
answer-percent-correct = { $percent } % správne
answer-percent-short = { $percent } %
max-credit-available = Maximálne možné hodnotenie: { $percent } %
attempts-remaining =
    { $count ->
        [0] nezostávajú žiadne pokusy
        [one] zostáva { $count } pokus
        [few] zostávajú { $count } pokusy
       *[other] zostáva { $count } pokusov
    }
validation-correct = (Správne)
validation-incorrect = (Nesprávne)
validation-partially-correct = (Čiastočne správne)
answer-show-responses =
    { $count ->
        [one] Zobraziť { $count } odpoveď na { $answerId }
        [few] Zobraziť { $count } odpovede na { $answerId }
       *[other] Zobraziť { $count } odpovedí na { $answerId }
    }

## Disclosure panels

feedback-heading = Spätná väzba
collapsible-click-to-open = (kliknutím otvoriť)
collapsible-click-to-close = (kliknutím zavrieť)
collapsible-initializing = Inicializácia…
footnote-show = Zobraziť poznámku pod čiarou
footnote-hide = Skryť poznámku pod čiarou
description-more-information = viac informácií

## Controls

slider-previous = Späť
slider-next = Ďalej
keyboard-open = Otvoriť klávesnicu
keyboard-close = Zavrieť klávesnicu
choice-input-remove-choice = Odobrať { $choice }
matrix-remove-row = Odobrať riadok
matrix-add-row = Pridať riadok
matrix-remove-column = Odobrať stĺpec
matrix-add-column = Pridať stĺpec
subset-add-remove-points = Pridať/odobrať body
subset-toggle-points-intervals = Prepnúť body a intervaly
subset-move-points = Presunúť body
subset-clear = Vymazať
orbital-add-row = Pridať riadok
orbital-remove-row = Odobrať riadok
orbital-add-box = Pridať políčko
orbital-remove-box = Odobrať políčko
orbital-add-up-arrow = Pridať šípku nahor
orbital-add-down-arrow = Pridať šípku nadol
orbital-remove-arrow = Odobrať šípku
orbital-row-label = Označenie riadka { $row }
pretzel-answer = Odpoveď

## Math input

math-input-preview-region = náhľad matematického výrazu
math-input-preview = Náhľad
math-input-invalid-expression = Neplatný výraz:

## Document status

viewer-initializing = Inicializácia…

## Errors

error-heading = Chyba
error-found-at =
    { $span ->
        [line] Nájdené na riadku { $startLine }.
       *[lines] Nájdené na riadkoch { $startLine }–{ $endLine }.
    }
document-contains-errors = Tento dokument obsahuje chyby!
diagnostic-heading-error = Chyba
diagnostic-heading-warning = Varovanie
diagnostic-heading-information = Informácia
diagnostic-heading-hint = Pomôcka
accessibility-heading-level-1 = Porušenie prístupnosti WCAG AA
accessibility-heading-level-2 = Upozornenie na prístupnosť
something-went-wrong = Niečo sa pokazilo.
renderer-load-failed = vykresľovací modul sa nepodarilo načítať. Je potrebné znova načítať stránku.
core-start-failed = Prehliadač dokumentu sa nepodarilo spustiť. Je potrebné znova načítať stránku.
