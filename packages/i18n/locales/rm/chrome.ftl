# Romansh viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Rumantsch Grischun; see `content.ftl`'s header for what that
# leaves to the five idioms.
#
# Two plural categories, `one` and `other`, and `one` does not catch zero, so
# the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Controllar…
answer-submitting = Trametter…
answer-checking-status = Controllar la resposta
answer-submitting-status = Trametter la resposta
answer-correct = Correct
answer-incorrect = Nuncorrect
answer-response-saved = Resposta memorisada
answer-percent-credit = { $percent }% dals puncts
answer-percent-correct = { $percent }% correct
answer-percent-short = { $percent } %
max-credit-available = Puncts maximals pussaivels: { $percent }%
attempts-remaining =
    { $count ->
        [0] naginas empruvas pli
        [one] resta { $count } empruva
       *[other] restan { $count } empruvas
    }
validation-correct = (Correct)
validation-incorrect = (Nuncorrect)
validation-partially-correct = (Per part correct)
answer-show-responses =
    { $count ->
        [one] Mussar { $count } resposta a { $answerId }
       *[other] Mussar { $count } respostas a { $answerId }
    }

## Disclosure panels

feedback-heading = Commentari
collapsible-click-to-open = (cliccar per avrir)
collapsible-click-to-close = (cliccar per serrar)
collapsible-initializing = Aviar…
footnote-show = Mussar la nota
footnote-hide = Zuppentar la nota
description-more-information = dapli infurmaziuns

## Controls

slider-previous = Precedent
slider-next = Proxim
keyboard-open = Avrir la tastatura
keyboard-close = Serrar la tastatura
choice-input-remove-choice = Allontanar { $choice }
matrix-remove-row = Allontanar ina lingia
matrix-add-row = Agiuntar ina lingia
matrix-remove-column = Allontanar ina colonna
matrix-add-column = Agiuntar ina colonna
subset-add-remove-points = Agiuntar/allontanar puncts
subset-toggle-points-intervals = Midar tranter puncts ed intervals
subset-move-points = Spustar ils puncts
subset-clear = Svidar
orbital-add-row = Agiuntar ina lingia
orbital-remove-row = Allontanar ina lingia
orbital-add-box = Agiuntar ina chascha
orbital-remove-box = Allontanar ina chascha
orbital-add-up-arrow = Agiuntar ina frizza si
orbital-add-down-arrow = Agiuntar ina frizza giu
orbital-remove-arrow = Allontanar ina frizza
orbital-row-label = Etichetta da la lingia { $row }
pretzel-answer = Resposta

## Math input

math-input-preview-region = prevista da l'expressiun matematica
math-input-preview = Prevista
math-input-invalid-expression = Expressiun nunvalida:

## Document status

viewer-initializing = Aviar…

## Errors

error-heading = Errur
error-found-at =
    { $span ->
        [line] Chattà en la lingia { $startLine }.
       *[lines] Chattà en las lingias { $startLine }–{ $endLine }.
    }
document-contains-errors = Quest document cuntegna errurs!
diagnostic-heading-error = Errur
diagnostic-heading-warning = Avertiment
diagnostic-heading-information = Infurmaziun
diagnostic-heading-hint = Indicaziun
accessibility-heading-level-1 = Violaziun da l'accessibladad tenor WCAG AA
accessibility-heading-level-2 = Avis d'accessibladad
something-went-wrong = Insatge è ì mal.
renderer-load-failed = in modul da represchentaziun n'è betg vegnì chargià. Chargiai danovamain la pagina.
core-start-failed = Il visualisatur dal document n'ha betg pudì vegnir avià. Chargiai danovamain la pagina.
