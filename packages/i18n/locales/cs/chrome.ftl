# Czech viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Czech counts in `one`, `few` and `other` for whole numbers; `many` is the
# fraction category and never applies to a count of attempts or responses, so
# it is not written out below. `other` takes the genitive plural — «5 pokusů»,
# not «5 pokusy».
#
# Register: impersonal. An instruction is the infinitive («Je třeba znovu
# načíst stránku»), which avoids choosing between ty and vy.
#
# A percent sign is preceded by a space in Czech typography when it is read as
# a noun («50 % hodnocení»), which is every use of it here.


## Answer submission

answer-checking = Probíhá kontrola…
answer-submitting = Probíhá odesílání…
answer-checking-status = Kontrola odpovědi
answer-submitting-status = Odesílání odpovědi
answer-correct = Správně
answer-incorrect = Nesprávně
answer-response-saved = Odpověď uložena
answer-percent-credit = { $percent } % hodnocení
answer-percent-correct = { $percent } % správně
answer-percent-short = { $percent } %
max-credit-available = Maximální možné hodnocení: { $percent } %
attempts-remaining =
    { $count ->
        [0] nezbývají žádné pokusy
        [one] zbývá { $count } pokus
        [few] zbývají { $count } pokusy
       *[other] zbývá { $count } pokusů
    }
validation-correct = (Správně)
validation-incorrect = (Nesprávně)
validation-partially-correct = (Částečně správně)
answer-show-responses =
    { $count ->
        [one] Zobrazit { $count } odpověď k { $answerId }
        [few] Zobrazit { $count } odpovědi k { $answerId }
       *[other] Zobrazit { $count } odpovědí k { $answerId }
    }

## Disclosure panels

feedback-heading = Zpětná vazba
collapsible-click-to-open = (kliknutím otevřít)
collapsible-click-to-close = (kliknutím zavřít)
collapsible-initializing = Inicializace…
footnote-show = Zobrazit poznámku pod čarou
footnote-hide = Skrýt poznámku pod čarou
description-more-information = více informací

## Controls

slider-previous = Zpět
slider-next = Další
keyboard-open = Otevřít klávesnici
keyboard-close = Zavřít klávesnici
choice-input-remove-choice = Odebrat { $choice }
matrix-remove-row = Odebrat řádek
matrix-add-row = Přidat řádek
matrix-remove-column = Odebrat sloupec
matrix-add-column = Přidat sloupec
subset-add-remove-points = Přidat/odebrat body
subset-toggle-points-intervals = Přepnout body a intervaly
subset-move-points = Přesunout body
subset-clear = Vymazat
orbital-add-row = Přidat řádek
orbital-remove-row = Odebrat řádek
orbital-add-box = Přidat rámeček
orbital-remove-box = Odebrat rámeček
orbital-add-up-arrow = Přidat šipku nahoru
orbital-add-down-arrow = Přidat šipku dolů
orbital-remove-arrow = Odebrat šipku
orbital-row-label = Popisek řádku { $row }
pretzel-answer = Odpověď

## Math input

math-input-preview-region = náhled matematického výrazu
math-input-preview = Náhled
math-input-invalid-expression = Neplatný výraz:

## Document status

viewer-initializing = Inicializace…

## Errors

error-heading = Chyba
error-found-at =
    { $span ->
        [line] Nalezeno na řádku { $startLine }.
       *[lines] Nalezeno na řádcích { $startLine }–{ $endLine }.
    }
document-contains-errors = Tento dokument obsahuje chyby!
diagnostic-heading-error = Chyba
diagnostic-heading-warning = Varování
diagnostic-heading-information = Informace
diagnostic-heading-hint = Nápověda
accessibility-heading-level-1 = Porušení přístupnosti WCAG AA
accessibility-heading-level-2 = Upozornění na přístupnost
something-went-wrong = Něco se pokazilo.
renderer-load-failed = vykreslovací modul se nepodařilo načíst. Je třeba znovu načíst stránku.
core-start-failed = Prohlížeč dokumentu se nepodařilo spustit. Je třeba znovu načíst stránku.
