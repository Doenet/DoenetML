# Occitan viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Languedocian reference variety, in classical orthography.
#
# Two plural categories, `one` and `other`. Occitan counts zero with the
# plural, so `[0]` is spelled out for the wording that names none rather than
# left to a category.


## Answer submission

answer-checking = Verificacion…
answer-submitting = Mandadís…
answer-checking-status = Verificacion de la responsa
answer-submitting-status = Mandadís de la responsa
answer-correct = Corrècte
answer-incorrect = Incorrècte
answer-response-saved = Responsa enregistrada
answer-percent-credit = { $percent }% de punts
answer-percent-correct = { $percent }% corrècte
answer-percent-short = { $percent } %
max-credit-available = Punts maximals possibles : { $percent }%
attempts-remaining =
    { $count ->
        [0] cap d'ensag que demòre
        [one] demòra { $count } ensag
       *[other] demòran { $count } ensages
    }
validation-correct = (Corrècte)
validation-incorrect = (Incorrècte)
validation-partially-correct = (Parcialament corrècte)
answer-show-responses =
    { $count ->
        [one] Mostrar { $count } responsa a { $answerId }
       *[other] Mostrar { $count } responsas a { $answerId }
    }

## Disclosure panels

feedback-heading = Comentari
collapsible-click-to-open = (clicatz per dobrir)
collapsible-click-to-close = (clicatz per tampar)
collapsible-initializing = Aviada…
footnote-show = Mostrar la nòta
footnote-hide = Amagar la nòta
description-more-information = mai d'informacions

## Controls

slider-previous = Precedent
slider-next = Seguent
keyboard-open = Dobrir lo clavièr
keyboard-close = Tampar lo clavièr
choice-input-remove-choice = Levar { $choice }
matrix-remove-row = Levar una linha
matrix-add-row = Apondre una linha
matrix-remove-column = Levar una colomna
matrix-add-column = Apondre una colomna
subset-add-remove-points = Apondre/levar de punts
subset-toggle-points-intervals = Bascular entre punts e intervals
subset-move-points = Desplaçar los punts
subset-clear = Escafar
orbital-add-row = Apondre una linha
orbital-remove-row = Levar una linha
orbital-add-box = Apondre una casa
orbital-remove-box = Levar una casa
orbital-add-up-arrow = Apondre una sageta cap amont
orbital-add-down-arrow = Apondre una sageta cap aval
orbital-remove-arrow = Levar una sageta
orbital-row-label = Etiqueta de la linha { $row }
pretzel-answer = Responsa

## Math input

math-input-preview-region = apercebut de l'expression matematica
math-input-preview = Apercebut
math-input-invalid-expression = Expression invalida :

## Document status

viewer-initializing = Aviada…

## Errors

error-heading = Error
error-found-at =
    { $span ->
        [line] Trobada a la linha { $startLine }.
       *[lines] Trobada a las linhas { $startLine }–{ $endLine }.
    }
document-contains-errors = Aqueste document conten d'errors !
diagnostic-heading-error = Error
diagnostic-heading-warning = Avertiment
diagnostic-heading-information = Informacion
diagnostic-heading-hint = Indici
accessibility-heading-level-1 = Violacion d'accessibilitat segon WCAG AA
accessibility-heading-level-2 = Alèrta d'accessibilitat
something-went-wrong = Quicòm a mal virat.
renderer-load-failed = un modul d'afichatge s'es pas cargat. Tornatz cargar la pagina.
core-start-failed = Lo visionador del document a pas pogut èsser aviat. Tornatz cargar la pagina.
