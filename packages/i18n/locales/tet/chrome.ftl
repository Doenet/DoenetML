# Tetum viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in **Tetun Dili** (Tetun Prasa), the variety that is co-official in
# Timor-Leste and the one the Instituto Nacional de Linguística's orthography
# standardizes — not Tetun Terik. That choice shows most in the vocabulary: this
# catalog uses the Portuguese loans the standard uses («verifika», «pájina»,
# «grosu») rather than coining, which is what Tetun Dili itself does, and the
# seam between the two is where a speaker's judgement is most wanted.
#
# Tetum marks no number on the noun — the plural is the postposed «sira» and a
# noun after a numeral does not take it — so a `{ $count -> … }` whose two
# English branches differ only in the noun renders one string here and the
# select is dropped. A `[0]` branch stays wherever English has one.


## Answer submission

answer-checking = Sei verifika…
answer-submitting = Sei haruka…
answer-checking-status = Sei verifika resposta
answer-submitting-status = Sei haruka resposta
answer-correct = Loos
answer-incorrect = La loos
answer-response-saved = Resposta rai ona
answer-percent-credit = { $percent }% kréditu
answer-percent-correct = { $percent }% loos
answer-percent-short = { $percent } %
max-credit-available = Kréditu máximu ne'ebé bele hetan: { $percent }%
# No select: «koko» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] la iha koko ida sei hela
       *[other] sei hela koko { $count }
    }
validation-correct = (Loos)
validation-incorrect = (La loos)
validation-partially-correct = (Loos parsialmente)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Hatudu resposta { $count } ba { $answerId }

## Disclosure panels

feedback-heading = Komentáriu
collapsible-click-to-open = (klik atu loke)
collapsible-click-to-close = (klik atu taka)
collapsible-initializing = Hahú hela…
footnote-show = Hatudu footnote
footnote-hide = Subar footnote
description-more-information = informasaun tan

## Controls

slider-previous = Uluk
slider-next = Tuirmai
keyboard-open = Loke tekladu
keyboard-close = Taka tekladu
choice-input-remove-choice = Hasai { $choice }
matrix-remove-row = Hasai liña
matrix-add-row = Tau tan liña
matrix-remove-column = Hasai koluna
matrix-add-column = Tau tan koluna
subset-add-remove-points = Tau/Hasai pontu
subset-toggle-points-intervals = Troka pontu ho intervalu
subset-move-points = Book pontu sira
subset-clear = Hamoos
orbital-add-row = Tau tan liña
orbital-remove-row = Hasai liña
orbital-add-box = Tau tan kaixa
orbital-remove-box = Hasai kaixa
orbital-add-up-arrow = Tau tan fleixa ba leten
orbital-add-down-arrow = Tau tan fleixa ba kraik
orbital-remove-arrow = Hasai fleixa
orbital-row-label = Etiketa ba liña { $row }
pretzel-answer = Resposta

## Math input

math-input-preview-region = pré-vizualizasaun ba espresaun matemátika
math-input-preview = Pré-vizualizasaun
math-input-invalid-expression = Espresaun la válidu:

## Document status

viewer-initializing = Hahú hela…

## Errors

error-heading = Sala
error-found-at =
    { $span ->
        [line] Hetan iha liña { $startLine }.
       *[lines] Hetan iha liña { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokumentu ne'e iha sala!
diagnostic-heading-error = Sala
diagnostic-heading-warning = Avizu
diagnostic-heading-information = Informasaun
diagnostic-heading-hint = Matadalan
accessibility-heading-level-1 = Violasaun asesibilidade WCAG AA
accessibility-heading-level-2 = Avizu kona-ba asesibilidade
something-went-wrong = Iha buat ida la loos.
renderer-load-failed = iha renderer ida la bele karega. Favor karega fali pájina ne'e.
core-start-failed = Vizualizadór dokumentu la bele hahú. Favor karega fali pájina ne'e.
