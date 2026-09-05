# Extremaduran (estremeñu) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script in the **OSCEC** standard (Órganu
# de Seguimientu i Coordinacinoacion del Estremeñu i la su Cultura), which is
# the only written norm Extremaduran has. What that norm makes visible, and
# what this file is consistent in:
#
#   * final unstressed **-o → -u** and **-e → -i**: «negru», «puntu»,
#     «verdi», «esti», «nombri» — with «pero» the one word this file leaves
#     in `-o` (six times, all in `diagnostics.ftl` and `editor.ftl`), since
#     Extremaduran writers vary between «pero» and «peru» and this seed did
#     not pick for them;
#   * infinitives in **-l** rather than -r: «amostral», «cerral», «mandal»,
#     «comprebal» — the single loudest marker in the file;
#   * participles **-ado → -áu**, **-ada → -á**: «coloráu», «puntiá»,
#     «alcontráu»;
#   * the clitic **«si»** for Spanish *se*: «no si pue», «si ignora»;
#   * **«i»** for *and*, «o» for *or*, «porqui» for *because*;
#   * «tieni» for *has*, «pue» for *can*.
#
# A line here without one of those markers is very likely still Spanish, and
# that is a reviewer's quickest check.
#
# **What is borrowed.** The technical nouns — «atributu», «componenti»,
# «documentu», «matriz», «estadísticas», «accessibiliá» — come from the
# learned Romance register an Extremaduran speaker meets through **Spanish**,
# which is the language of schooling in Extremadura. There is no Extremaduran
# computing vocabulary to take them from, and they are borrowed openly rather
# than disguised. `WCAG AA` and `DoenetML` are names and stay in English.
#
# **Counts.** CLDR has **no plural data for `ext`**, so `Intl.PluralRules`
# falls back to the root locale, where the only category is `other` and an
# `[one]` branch could never be selected. This catalog therefore writes **no**
# `[one]`, `[zero]`, `[two]`, `[few]` or `[many]` branch anywhere: where
# English selects on number, one form is written that reads for any count.
# The numeric literal `[0]` in `attempts-remaining` is a different mechanism —
# an exact-value match, not a plural category — and is kept, because "no
# attempts left" is worth saying in its own words.
#
# **Numbers** render in Latin digits everywhere, which is what Extremaduran
# uses.
#
# **Weakest first.** The button verbs, which no Extremaduran software has ever
# had to name: «comprebal», «mandal», «añidil», «quital». After those, whether
# a reviewer wants «los»/«las» or the «lus» some writers prefer — the file is
# uniformly «los»/«las».


## Answer submission

answer-checking = Comprebandu…
answer-submitting = Mandandu…
answer-checking-status = Comprebandu la respuesta
answer-submitting-status = Mandandu la respuesta
answer-correct = Correutu
answer-incorrect = Incorreutu
answer-response-saved = Respuesta guardá
answer-percent-credit = { $percent }% de los puntus
answer-percent-correct = { $percent }% correutu
answer-percent-short = { $percent } %
max-credit-available = Puntus máximus qu'es posibri consiguil: { $percent }%
attempts-remaining =
    { $count ->
        [0] no quea dengún intentu
       *[other] quean { $count } intentus
    }
validation-correct = (Correutu)
validation-incorrect = (Incorreutu)
validation-partially-correct = (En parti correutu)
answer-show-responses = Amostral las { $count } respuestas a { $answerId }

## Disclosure panels

feedback-heading = Comentariu
collapsible-click-to-open = (pincha p'abril)
collapsible-click-to-close = (pincha pa cerral)
collapsible-initializing = Empeçandu…
footnote-show = Amostral la nota
footnote-hide = Escondel la nota
description-more-information = mas informacion

## Controls

slider-previous = Anteriol
slider-next = Siguienti
keyboard-open = Abril el tecláu
keyboard-close = Cerral el tecláu
choice-input-remove-choice = Quital { $choice }
matrix-remove-row = Quital una hila
matrix-add-row = Añidil una hila
matrix-remove-column = Quital una coluna
matrix-add-column = Añidil una coluna
subset-add-remove-points = Añidil/quital puntus
subset-toggle-points-intervals = Cambeal entri puntus i intervalus
subset-move-points = Movel los puntus
subset-clear = Limpial
orbital-add-row = Añidil una hila
orbital-remove-row = Quital una hila
orbital-add-box = Añidil una caha
orbital-remove-box = Quital una caha
orbital-add-up-arrow = Añidil una hlecha p'arriba
orbital-add-down-arrow = Añidil una hlecha p'abahu
orbital-remove-arrow = Quital la hlecha
orbital-row-label = Etiqueta de la hila { $row }
pretzel-answer = Respuesta

## Math input

math-input-preview-region = vista previa de la espresion matemática
math-input-preview = Vista previa
math-input-invalid-expression = Espresion no válida:

## Document status

viewer-initializing = Empeçandu…

## Errors

error-heading = Erru
error-found-at =
    { $span ->
        [line] Alcontráu en la linia { $startLine }.
       *[lines] Alcontráu en las linias { $startLine }–{ $endLine }.
    }
document-contains-errors = ¡Esti documentu tieni errus!
diagnostic-heading-error = Erru
diagnostic-heading-warning = Avisu
diagnostic-heading-information = Informacion
diagnostic-heading-hint = Pista
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Vurneracion d'accessibiliá WCAG AA
accessibility-heading-level-2 = Avisu d'accessibiliá
something-went-wrong = Argu salió mal.
renderer-load-failed = un módulu de representacion no si puó cargal. Vuervi a cargal la páhina.
core-start-failed = Esti documentu no si puó empeçal. Vuervi a cargal la páhina.
core-start-failed-busy = Esti documentu no si puó empeçal. Muchus documentus empeçavan a un tiempu, i nun trastu mas lentu esu pue tardal mas. Vurvel a cargal la páhina pue ayual en cuantu los otrus documentus ayan acabáu.
core-start-failed-retry = Esti documentu no si puó empeçal.
core-start-failed-busy-retry = Esti documentu no si puó empeçal. Muchus documentus empeçavan a un tiempu, i nun trastu mas lentu esu pue tardal mas.
core-start-retry = Prueva otra vez
saved-state-unavailable = El tu trabahu guardáu no si puó cargal.
