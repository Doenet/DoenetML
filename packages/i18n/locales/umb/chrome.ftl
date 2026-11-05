# Umbundu viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the concord table, for what separates this
# catalog from `locales/kmb`, and for what a speaker should check first.


## Answer submission

answer-checking = Oku konomboloya…
answer-submitting = Oku tuma…
answer-checking-status = Etambululo li kasi oku konomboloyiwa
answer-submitting-status = Etambululo li kasi oku tumiwa
answer-correct = Cocili
answer-incorrect = Ka cocili
answer-response-saved = Etambululo Lya Vikiwa
answer-percent-credit = { $percent }% Yolonoso
answer-percent-correct = { $percent }% Cocili
answer-percent-short = { $percent } %
max-credit-available = Olonoso vinene o pondola oku tambula: { $percent }%
attempts-remaining =
    { $count ->
        [0] kaku sialele elilongiso
        [one] elilongiso { $count } lya sialele
       *[other] alilongiso { $count } a sialele
    }
validation-correct = (Cocili)
validation-incorrect = (Ka cocili)
validation-partially-correct = (Cocili konepa)
answer-show-responses =
    { $count ->
        [one] Lekisa etambululo { $count } lya { $answerId }
       *[other] Lekisa atambululo { $count } a { $answerId }
    }

## Disclosure panels

feedback-heading = Etambululo
collapsible-click-to-open = (yeta oco ci yulule)
collapsible-click-to-close = (yeta oco ci yike)
collapsible-initializing = Oku fetika…
footnote-show = Lekisa esapulo lyokemehi
footnote-hide = Seluka esapulo lyokemehi
description-more-information = ovina vikwavo

## Controls

slider-previous = Yipita
slider-next = Yikwãma
keyboard-open = Yulula Otekiladu
keyboard-close = Yika Otekiladu
choice-input-remove-choice = Pindula { $choice }
matrix-remove-row = Pindula ongoli
matrix-add-row = Vokiya ongoli
matrix-remove-column = Pindula okoluna
matrix-add-column = Vokiya okoluna
subset-add-remove-points = Vokiya/Pindula olondimbu
subset-toggle-points-intervals = Pongolola olondimbu lolotembo
subset-move-points = Nyingisa Olondimbu
subset-clear = Yepisa
orbital-add-row = Vokiya Ongoli
orbital-remove-row = Pindula Ongoli
orbital-add-box = Vokiya Ocikuta
orbital-remove-box = Pindula Ocikuta
orbital-add-up-arrow = Vokiya Oseta Yokilu
orbital-add-down-arrow = Vokiya Oseta Yokemehi
orbital-remove-arrow = Pindula Oseta
orbital-row-label = Onduko yongoli { $row }
pretzel-answer = Etambululo

## Math input

math-input-preview-region = oku tala tete ondaka yomatematika
math-input-preview = Tala tete
math-input-invalid-expression = Ondaka ka ya sungulukile:

## Document status

viewer-initializing = Oku fetika…

## Errors

error-heading = Eviho
error-found-at =
    { $span ->
        [line] Lya sangiwa kongoli { $startLine }.
       *[lines] Lya sangiwa kolongoli { $startLine }–{ $endLine }.
    }
document-contains-errors = Elivulu lilo li kwete oviho!
diagnostic-heading-error = Eviho
diagnostic-heading-warning = Elungulo
diagnostic-heading-information = Esapulo
diagnostic-heading-hint = Ekwatiso
accessibility-heading-level-1 = Elueyo lya WCAG AA Kokupitĩla
accessibility-heading-level-2 = Elungulo lyokupitĩla
something-went-wrong = Cimwe ka ca lingile ciwa.
renderer-load-failed = ulekisi umwe ka weyile. Tu ku pinga, tiukulula etapa.
core-start-failed = Ulekisi welivulu ka wa tẽlele oku fetika. Tu ku pinga, tiukulula etapa.
