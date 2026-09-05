# Papiamentu (Kòrsou/Boneiru) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This catalog is written in the **phonological orthography
# of Curaçao and Bonaire** — Papiamentu, spelled «kas», «yu», «skol», «bèk»,
# «buki», «hende». The **etymological orthography of Aruba** — Papiamento,
# spelled «cas», «hoben», «trece» — is a real and equally official
# alternative, and it is deliberately **not** mixed into any of these four
# files. A reviewer from Aruba would **respell** this catalog rather than
# retranslate it: the words are the same, the spelling system is not.
#
# The letters that carry the distinction:
#
#   * **`k`** and **`s`** where the etymological system writes `c`, `qu` or
#     `z` — «kas» / «cas», «kòrekto» / «correcto», «sero» / «cero»,
#     «kuadro» / «cuadro».
#   * **`y`** where it writes `j` or `ll` — «yu» / «hijo», «yena» / «llena»,
#     «ayuda» / «ayuda» beside «mihó» / «mejor».
#   * **`è`, `ò`, `ù`** for the open and rounded vowels — «bèk», «pòst»,
#     «dùsh», «fèrf». These are **letters of the alphabet**, not stress
#     marks, and a reviewer must not strip the diacritic off them.
#
# Separately from those three letters, Papiamentu writes an **acute accent**
# for irregular stress and tone — «kámbia», and the «paña» / «pañá» pattern
# where the accent is the whole of the difference. This seed marks stress only
# where the standard orthography requires it, and accent placement is the one
# thing a reviewer should check key by key.
#
# **Number.** `Intl.PluralRules("pap")` resolves to `pap` and reports
# `['one','other']`. Papiamentu pluralizes with «-nan», but a noun after a
# numeral is **unmarked** — «dos kas», never «dos kasnan» — so both branches
# would be word-for-word identical here, and every count message is written as
# **one unselected form** rather than as two identical branches. English's
# explicit `[0]` literal in `attempts-remaining` matches the number itself and
# is kept as a branch.
#
# **Loans, named.** Papiamentu freely takes Dutch- and Spanish-mediated
# technical nouns, and this seed keeps them rather than coining: «funshon»,
# «matriz», «komponente», «atributo», «diagnóstiko», «seksion», «solushon»,
# «ehèmpel», «pregunta», «kòrekto», «statístika», «klavier». The grammar
# around them is Papiamentu throughout: the preverbal markers «ta / a / lo /
# tabata», «no» for negation, «di» for possession, «pa» for purpose. No
# sentence in these four files is Dutch or Spanish.
#
# **The technical vocabulary here is a lexifier loan set.** Every technical
# noun in this file is a Dutch- or Spanish-mediated loan — those are the words
# Papiamentu actually uses, not a substitute for a native term — carried in
# Papiamentu's own orthography and Papiamentu's own grammar. The sentences
# around the loans are Papiamentu, not Dutch and not Spanish.


## Answer submission — the check-work button and the status it reports.

answer-checking = Ta kontrolá...
answer-submitting = Ta manda...

answer-checking-status = Ta kontrolá kontesta
answer-submitting-status = Ta manda kontesta

answer-correct = Kòrekto
answer-incorrect = Inkòrekto

answer-response-saved = Kontesta Wardá

answer-percent-credit = { $percent }% Krédito
answer-percent-correct = { $percent }% Kòrekto
answer-percent-short = { $percent } %

max-credit-available = Máksimo krédito disponibel: { $percent }%

attempts-remaining =
    { $count ->
        [0] no tin mas purbamentu
       *[other] { $count } purbamentu ta sobra
    }

validation-correct = (Kòrekto)
validation-incorrect = (Inkòrekto)
validation-partially-correct = (Parsialmente kòrekto)

answer-show-responses = Mustra { $count } kontesta na { $answerId }


## Disclosure panels

feedback-heading = Komentario

collapsible-click-to-open = (klek pa habri)
collapsible-click-to-close = (klek pa sera)

collapsible-initializing = Ta inisiá...

footnote-show = Mustra nota
footnote-hide = Skonde nota

description-more-information = mas informashon


## Controls

slider-previous = Anterior
slider-next = Siguiente

keyboard-open = Habri Klavier
keyboard-close = Sera Klavier

choice-input-remove-choice = Kita { $choice }

matrix-remove-row = Kita fila
matrix-add-row = Agregá fila
matrix-remove-column = Kita kolumna
matrix-add-column = Agregá kolumna

subset-add-remove-points = Agregá/Kita punto
subset-toggle-points-intervals = Kambia entre punto i intervalo
subset-move-points = Move Punto
subset-clear = Bòrsa

orbital-add-row = Agregá Fila
orbital-remove-row = Kita Fila
orbital-add-box = Agregá Kaha
orbital-remove-box = Kita Kaha
orbital-add-up-arrow = Agregá Flecha Ariba
orbital-add-down-arrow = Agregá Flecha Abou
orbital-remove-arrow = Kita Flecha

orbital-row-label = Etiketa pa fila { $row }

pretzel-answer = Kontesta



## Math input

math-input-preview-region = vista previa di ekspreshon matemátiko
math-input-preview = Vista previa
math-input-invalid-expression = Ekspreshon inválido:


## Document status

viewer-initializing = Ta inisiá...


## Errors

error-heading = Eror

error-found-at =
    { $span ->
        [line] Hañá na liña { $startLine }.
       *[lines] Hañá na liña { $startLine }–{ $endLine }.
    }

document-contains-errors = E dokumento aki tin eror!

diagnostic-heading-error = Eror
diagnostic-heading-warning = Atvertensia
diagnostic-heading-information = Informashon
diagnostic-heading-hint = Sugerensia

accessibility-heading-level-1 = Violashon di Aksesibilidat WCAG AA
accessibility-heading-level-2 = Alerta di aksesibilidat

something-went-wrong = Algu a bai robes.

renderer-load-failed = un renderisadó no a logra karga. Por fabor rekargá e página.

core-start-failed = E dokumento aki no por a kuminsá. Por fabor rekargá e página.

core-start-failed-busy = E dokumento aki no por a kuminsá. Vários dokumento tabata kuminsá na mes momento, i esei por dura mas largu riba un aparato mas lento. Rekargá e página por yuda ora e otro dokumentonan kaba.

core-start-failed-retry = E dokumento aki no por a kuminsá.

core-start-failed-busy-retry = E dokumento aki no por a kuminsá. Vários dokumento tabata kuminsá na mes momento, i esei por dura mas largu riba un aparato mas lento.

core-start-retry = Purba atrobe

saved-state-unavailable = Bo trabou wardá no por a karga.
