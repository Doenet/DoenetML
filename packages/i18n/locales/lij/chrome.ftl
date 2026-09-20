# Ligurian (ligure) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **grafîa ofiçiâ** — the spelling the
# Académia Ligùstica do Brénno publishes in — and the marks in it are letters
# rather than decoration:
#   * **«ç»** is a letter and is not interchangeable with «s» or «z»;
#   * the **circumflex** marks a long stressed vowel and distinguishes words:
#     «figûa» ≠ «figua», «erô» ≠ «ero»;
#   * **«ñ»** writes the velar nasal — «neuña», «cazaña» — and is never
#     respelled «gn», which is a different sound in this language;
#   * **«eu»** is a rounded front vowel, one letter's worth of sound.
# A corrector who strips the diacritics is not simplifying the file, it is
# writing different words.
#
# **This is Genoese**, the variety the Académia standardizes and Ligurian
# publishing uses, not Intemelio, not Spezzino. A deployment that wants another
# supplies its own catalog as `localeResources` — the trade `locales/sc` and
# `locales/rm` already record.
#
# **Number.** CLDR has plural rules for `lij` — `one` and `other` — so a
# category branch here is selected by Ligurian's own rules. Ligurian marks
# number on the article and on the noun, so the split English draws is a real
# one.


## Answer submission

answer-checking = Contròllo…
answer-submitting = Mando…
answer-checking-status = Contròllo a risposta
answer-submitting-status = Mando a risposta
answer-correct = Giusto
answer-incorrect = Sbagliòu
answer-response-saved = Risposta sarvâ
answer-percent-credit = { $percent }% de ponti
answer-percent-correct = { $percent }% giusto
answer-percent-short = { $percent } %
max-credit-available = Ponti mascimi che se peu avei: { $percent }%
attempts-remaining =
    { $count ->
        [0] nisciun tentatuo che resta
        [one] { $count } tentatuo che resta
       *[other] { $count } tentatuoi che restan
    }
validation-correct = (Giusto)
validation-incorrect = (Sbagliòu)
validation-partially-correct = (In parte giusto)
answer-show-responses =
    { $count ->
        [one] Fanni vedde { $count } risposta a { $answerId }
       *[other] Fanni vedde { $count } risposte a { $answerId }
    }

## Disclosure panels

feedback-heading = Comento
collapsible-click-to-open = (sciacca pe arvî)
collapsible-click-to-close = (sciacca pe serrâ)
collapsible-initializing = Se comensa…
footnote-show = Fanni vedde a nòtta
footnote-hide = Ascondi a nòtta
description-more-information = ciù informaçioin

## Controls

slider-previous = Precedente
slider-next = Pròscimo
keyboard-open = Arvi a tastêa
keyboard-close = Serra a tastêa
choice-input-remove-choice = Leva { $choice }
matrix-remove-row = Leva 'na riga
matrix-add-row = Azonzi 'na riga
matrix-remove-column = Leva 'na colònna
matrix-add-column = Azonzi 'na colònna
subset-add-remove-points = Azonzi / leva ponti
subset-toggle-points-intervals = Cangia tra ponti e intervalli
subset-move-points = Mescia i ponti
subset-clear = Neta
orbital-add-row = Azonzi 'na riga
orbital-remove-row = Leva 'na riga
orbital-add-box = Azonzi 'na casella
orbital-remove-box = Leva 'na casella
orbital-add-up-arrow = Azonzi 'na frecia in sciù
orbital-add-down-arrow = Azonzi 'na frecia in zù
orbital-remove-arrow = Leva a frecia
orbital-row-label = Etichetta pe-a riga { $row }
pretzel-answer = Risposta

## Math input

math-input-preview-region = anteprimma da espresción matemattica
math-input-preview = Anteprimma
math-input-invalid-expression = Espresción no vallida:

## Document status

viewer-initializing = Se comensa…

## Errors

error-heading = Erô
error-found-at =
    { $span ->
        [line] Trovòu inta riga { $startLine }.
       *[lines] Trovòu inte righe { $startLine }–{ $endLine }.
    }
document-contains-errors = Sto documento o gh'à drento di erôi!
diagnostic-heading-error = Erô
diagnostic-heading-warning = Avvertimento
diagnostic-heading-information = Informaçión
diagnostic-heading-hint = Conseggio
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Violaçión de acesciblitæ WCAG AA
accessibility-heading-level-2 = Avvizo de acesciblitæ
something-went-wrong = Quarcösa a l'é anæta storta.
renderer-load-failed = un mòdulo de vixualizaçión o no s'é caregòu. Torna a caregâ a pagina.
core-start-failed = No s'é riuscîo a fâ partî sto documento. Torna a caregâ a pagina.
core-start-failed-busy = No s'é riuscîo a fâ partî sto documento. Ciù documenti partivan tutti insemme, e in sce 'na machina ciù lenta o peu tiâ ciù a longo. Tornâ a caregâ a pagina o peu agiuâ quande i atri documenti an finîo.
core-start-failed-retry = No s'é riuscîo a fâ partî sto documento.
core-start-failed-busy-retry = No s'é riuscîo a fâ partî sto documento. Ciù documenti partivan tutti insemme, e in sce 'na machina ciù lenta o peu tiâ ciù a longo.
core-start-retry = Preuva torna
saved-state-unavailable = No s'é riuscîo a caregâ o teu travaggio sarvòu.
