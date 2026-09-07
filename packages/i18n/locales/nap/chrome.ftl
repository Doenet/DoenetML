# Neapolitan (napulitano) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The traditional literary spelling Neapolitan publishing
# uses, in which the **final unstressed vowel is written «e»** and read as a
# schwa — «pàggene», «nomme», «esercizie» — rather than being dropped or
# written with an apostrophe. The **apocopated article «'o», «'a», «'e»** keeps
# its apostrophe, because that apostrophe marks a lost syllable rather than
# decorating the word.
#
# **Metaphony is the loudest thing in this file**, and it is not a spelling
# habit but the morphology: a stressed vowel raises in the masculine singular
# and does not in the feminine — «gruosso» against «grossa», «russo» against
# «rossa», «niro» against «nera». Every `$gender` fork in `content.ftl` where
# the two forms differ by more than an ending is metaphony doing that, and
# "regularizing" one of the pair to match the other is what would make this
# file Italian in Neapolitan clothes.
#
# **Number.** CLDR has **no** plural rules for `nap`:
# `Intl.PluralRules("nap")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch in this file would be selected by some
# other language. None appears anywhere. `one`/`other` is kept because it is
# the split the fallback happens to make correctly here too, and `[0]` is
# matched against the number itself and so stays legal.


## Answer submission

answer-checking = Stongo a cuntrullà…
answer-submitting = Stongo a mannà…
answer-checking-status = Stongo a cuntrullà 'a risposta
answer-submitting-status = Stongo a mannà 'a risposta
answer-correct = Giusto
answer-incorrect = Sbagliato
answer-response-saved = Risposta sarvata
answer-percent-credit = { $percent }% 'e punte
answer-percent-correct = { $percent }% giusto
answer-percent-short = { $percent } %
max-credit-available = Massemo 'e punte ca se ponno piglià: { $percent }%
attempts-remaining =
    { $count ->
        [0] nisciuna prova ca resta
        [one] { $count } prova ca resta
       *[other] { $count } prove ca restano
    }
validation-correct = (Giusto)
validation-incorrect = (Sbagliato)
validation-partially-correct = (Nu poco giusto)
answer-show-responses =
    { $count ->
        [one] Mmostra { $count } risposta a { $answerId }
       *[other] Mmostra { $count } risposte a { $answerId }
    }

## Disclosure panels

feedback-heading = Cummiento
collapsible-click-to-open = (schiaffa pe arapì)
collapsible-click-to-close = (schiaffa pe chiudere)
collapsible-initializing = Se sta appiccianno…
footnote-show = Mmostra 'a nota
footnote-hide = Annascunne 'a nota
description-more-information = cchiù nfurmazione

## Controls

slider-previous = Precedente
slider-next = Prossimo
keyboard-open = Arape 'a tastiera
keyboard-close = Chiure 'a tastiera
choice-input-remove-choice = Leva { $choice }
matrix-remove-row = Leva na riga
matrix-add-row = Aggiunge na riga
matrix-remove-column = Leva na culonna
matrix-add-column = Aggiunge na culonna
subset-add-remove-points = Aggiunge / leva punte
subset-toggle-points-intervals = Cagna 'nfra punte e ntervalle
subset-move-points = Move 'e punte
subset-clear = Pulezza
orbital-add-row = Aggiunge na riga
orbital-remove-row = Leva na riga
orbital-add-box = Aggiunge na casella
orbital-remove-box = Leva na casella
orbital-add-up-arrow = Aggiunge na freccia ncoppa
orbital-add-down-arrow = Aggiunge na freccia sotto
orbital-remove-arrow = Leva 'a freccia
orbital-row-label = Etichetta p''a riga { $row }
pretzel-answer = Risposta

## Math input

math-input-preview-region = anteprimma d''a spressione matematica
math-input-preview = Anteprimma
math-input-invalid-expression = Spressione ca nun va bbona:

## Document status

viewer-initializing = Se sta appiccianno…

## Errors

error-heading = Errore
error-found-at =
    { $span ->
        [line] Truvato ncopp''a riga { $startLine }.
       *[lines] Truvato ncopp''e righe { $startLine }–{ $endLine }.
    }
document-contains-errors = Stu documento tene errore dinto!
diagnostic-heading-error = Errore
diagnostic-heading-warning = Avviso
diagnostic-heading-information = Nfurmazione
diagnostic-heading-hint = Cunziglio
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Vviulazione 'e accessibbilità WCAG AA
accessibility-heading-level-2 = Avviso 'e accessibbilità
something-went-wrong = Quaccosa è gghiuto storto.
renderer-load-failed = nu mòdulo 'e visualizzazione nun s'è carrecato. Càrreca n'ata vota 'a paggena.
core-start-failed = Nun s'è arrivato a fà partì stu documento. Càrreca n'ata vota 'a paggena.
core-start-failed-busy = Nun s'è arrivato a fà partì stu documento. Cchiù documente partevano tutte nzieme, e ncopp'a na machina cchiù lenta pò durà cchiù assaje. Carrecà n'ata vota 'a paggena pò aiutà quanno ll'ate documente hanno fernuto.
core-start-failed-retry = Nun s'è arrivato a fà partì stu documento.
core-start-failed-busy-retry = Nun s'è arrivato a fà partì stu documento. Cchiù documente partevano tutte nzieme, e ncopp'a na machina cchiù lenta pò durà cchiù assaje.
core-start-retry = Prova n'ata vota
saved-state-unavailable = Nun s'è arrivato a carrecà 'o llavoro tuoio sarvato.
