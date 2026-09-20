# Piedmontese (piemontèis) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **grafìa piemontèisa** of Pacotto and Viglongo, which is
# what Piedmontese publishing and the Companìa dj'Amis dël Piemontèis use.
# Four things in it are letters rather than decoration:
#   * **«ë»** is the schwa and is a vowel of its own — «lë», «dë», «bërgna» —
#     never an «e» with a mark on it;
#   * **«ò»** is the open o and **«ù»** the close u, and both distinguish
#     words;
#   * **«n-»** writes the velar nasal, as in «piemont-èis»-type forms, and is
#     not an «n» with a stray hyphen;
#   * **«eu»** is a rounded front vowel, one sound.
# A corrector who strips these is writing different words.
#
# **Verbal particles.** Piedmontese puts an obligatory particle before a finite
# verb — «a l'é», «a son», «as peul», «a l'ha» — and it is what makes a
# sentence Piedmontese rather than Italian in Piedmontese spelling. A sentence
# in these four files without one is very likely still Italian.
#
# **Number.** CLDR has **no** plural rules for `pms`:
# `Intl.PluralRules("pms")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch in this file would be selected by some
# other language. None appears anywhere. `one`/`other` is kept because it is
# the split the fallback happens to make correctly for Piedmontese too, and
# `[0]` is matched against the number itself and so stays legal.


## Answer submission

answer-checking = I contròlo…
answer-submitting = I mando…
answer-checking-status = I contròlo la rispòsta
answer-submitting-status = I mando la rispòsta
answer-correct = Giust
answer-incorrect = Sbaglià
answer-response-saved = Rispòsta salvà
answer-percent-credit = { $percent }% ëd pont
answer-percent-correct = { $percent }% giust
answer-percent-short = { $percent } %
max-credit-available = Pont màssim che as peulo pijesse: { $percent }%
attempts-remaining =
    { $count ->
        [0] gnun tentativ ch'a resta
        [one] { $count } tentativ ch'a resta
       *[other] { $count } tentativ ch'a resto
    }
validation-correct = (Giust)
validation-incorrect = (Sbaglià)
validation-partially-correct = (An part giust)
answer-show-responses =
    { $count ->
        [one] Mostra { $count } rispòsta a { $answerId }
       *[other] Mostra { $count } rispòste a { $answerId }
    }

## Disclosure panels

feedback-heading = Coment
collapsible-click-to-open = (sgnaca për deurbe)
collapsible-click-to-close = (sgnaca për sarè)
collapsible-initializing = As anandia…
footnote-show = Mostra la nòta
footnote-hide = Stërma la nòta
description-more-information = pì anformassion

## Controls

slider-previous = Precedent
slider-next = Pròssim
keyboard-open = Deurb la tastera
keyboard-close = Sara la tastera
choice-input-remove-choice = Gava { $choice }
matrix-remove-row = Gava na riga
matrix-add-row = Gionta na riga
matrix-remove-column = Gava na colòna
matrix-add-column = Gionta na colòna
subset-add-remove-points = Gionta / gava pont
subset-toggle-points-intervals = Cambia tra pont e antërval
subset-move-points = Sposta ij pont
subset-clear = Netia
orbital-add-row = Gionta na riga
orbital-remove-row = Gava na riga
orbital-add-box = Gionta na casela
orbital-remove-box = Gava na casela
orbital-add-up-arrow = Gionta na flecia an su
orbital-add-down-arrow = Gionta na flecia an giù
orbital-remove-arrow = Gava la flecia
orbital-row-label = Etichëtta për la riga { $row }
pretzel-answer = Rispòsta

## Math input

math-input-preview-region = anteprima dl'espression matemàtica
math-input-preview = Anteprima
math-input-invalid-expression = Espression nen bon-a:

## Document status

viewer-initializing = As anandia…

## Errors

error-heading = Eror
error-found-at =
    { $span ->
        [line] Trovà an sla riga { $startLine }.
       *[lines] Trovà an slë righe { $startLine }–{ $endLine }.
    }
document-contains-errors = Sto document a l'ha andrinta dj'eror!
diagnostic-heading-error = Eror
diagnostic-heading-warning = Avis
diagnostic-heading-information = Anformassion
diagnostic-heading-hint = Consej
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Violassion d'assessibilità WCAG AA
accessibility-heading-level-2 = Avis d'assessibilità
something-went-wrong = Quaicòs a l'é andàit stòrt.
renderer-load-failed = un mòdul ëd visualisassion a l'é nen cariasse. Caria torna la pàgina.
core-start-failed = As é nen riussisse a fé parte sto document. Caria torna la pàgina.
core-start-failed-busy = As é nen riussisse a fé parte sto document. Pì document a partìo tuti ansema, e su na màchina pì lenta a peul tiré pì longh. Carié torna la pàgina a peul giuté quand che j'àutri document a l'han finì.
core-start-failed-retry = As é nen riussisse a fé parte sto document.
core-start-failed-busy-retry = As é nen riussisse a fé parte sto document. Pì document a partìo tuti ansema, e su na màchina pì lenta a peul tiré pì longh.
core-start-retry = Preuva torna
saved-state-unavailable = As é nen riussisse a carié tò travaj salvà.
