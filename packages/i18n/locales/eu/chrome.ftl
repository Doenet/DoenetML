# Basque viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Basque counts in the same two plural categories English does, so every
# `{ $count -> … }` below keeps the shape it had.

## Answer submission

answer-checking = Egiaztatzen…
answer-submitting = Bidaltzen…

answer-checking-status = Erantzuna egiaztatzen
answer-submitting-status = Erantzuna bidaltzen

answer-correct = Zuzena
answer-incorrect = Okerra

answer-response-saved = Erantzuna gordeta

answer-percent-credit = %{ $percent } puntu
answer-percent-correct = %{ $percent } zuzen
answer-percent-short = { $percent } %

max-credit-available = Eskuragarri dagoen gehieneko puntuazioa: %{ $percent }

attempts-remaining =
    { $count ->
        [0] ez da saiakerarik geratzen
        [one] saiakera { $count } geratzen da
       *[other] { $count } saiakera geratzen dira
    }

validation-correct = (Zuzena)
validation-incorrect = (Okerra)
validation-partially-correct = (Partzialki zuzena)

answer-show-responses =
    { $count ->
        [one] Erakutsi { $answerId } atalaren erantzun { $count }
       *[other] Erakutsi { $answerId } atalaren { $count } erantzun
    }


## Disclosure panels

feedback-heading = Iruzkina

collapsible-click-to-open = (egin klik irekitzeko)
collapsible-click-to-close = (egin klik ixteko)

collapsible-initializing = Hasieratzen…

footnote-show = Erakutsi oin-oharra
footnote-hide = Ezkutatu oin-oharra

description-more-information = informazio gehiago


## Controls

slider-previous = Aurrekoa
slider-next = Hurrengoa

keyboard-open = Ireki teklatua
keyboard-close = Itxi teklatua

choice-input-remove-choice = Kendu { $choice }

matrix-remove-row = Kendu errenkada
matrix-add-row = Gehitu errenkada
matrix-remove-column = Kendu zutabea
matrix-add-column = Gehitu zutabea

subset-add-remove-points = Gehitu/kendu puntuak
subset-toggle-points-intervals = Txandakatu puntuak eta tarteak
subset-move-points = Mugitu puntuak
subset-clear = Garbitu

orbital-add-row = Gehitu errenkada
orbital-remove-row = Kendu errenkada
orbital-add-box = Gehitu laukia
orbital-remove-box = Kendu laukia
orbital-add-up-arrow = Gehitu gorako gezia
orbital-add-down-arrow = Gehitu beherako gezia
orbital-remove-arrow = Kendu gezia

orbital-row-label = { $row }. errenkadaren etiketa

pretzel-answer = Erantzuna

summary-statistics-caption = { $column } zutabearen laburpen-estatistikak


## Math input

math-input-preview-region = adierazpen matematikoaren aurrebista
math-input-preview = Aurrebista
math-input-invalid-expression = Adierazpen baliogabea:


## Document status

viewer-initializing = Hasieratzen…


## Errors

error-heading = Errorea

error-found-at =
    { $span ->
        [line] { $startLine }. lerroan aurkitua.
       *[lines] { $startLine }–{ $endLine } lerroetan aurkitua.
    }

document-contains-errors = Dokumentu honek erroreak ditu!

diagnostic-heading-error = Errorea
diagnostic-heading-warning = Abisua
diagnostic-heading-information = Informazioa
diagnostic-heading-hint = Iradokizuna

accessibility-heading-level-1 = WCAG AA irisgarritasun-urraketa
accessibility-heading-level-2 = Irisgarritasun-oharra

something-went-wrong = Zerbait gaizki joan da.

renderer-load-failed = errendatzaile bat ezin izan da kargatu. Kargatu orria berriro.

core-start-failed = Ezin izan da dokumentuaren ikustailea abiarazi. Kargatu orria berriro.
