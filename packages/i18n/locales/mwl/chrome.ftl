# Mirandese (mirandés) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Mirandese is Asturleonese, not Portuguese.** It is spoken in the Tierra de
# Miranda in Trás-os-Montes and co-official there since 1999, but it descends
# from the Astur-Leonese of the medieval kingdom of León and its nearest
# relatives are Asturian and Leonese — `locales/ast`, not `locales/pt`. That is
# why «lhuç», «lhinha», «nuobo», «tierra», «fuonte», «cierto» and the definite
# article «l» / «la» / «ls» / «las» look the way they do: initial l- written
# «lh-», the Latin short vowels diphthongized to «ie» and «uo», and no
# Portuguese «o»/«a» article anywhere.
#
# **Script: Latin, in the Convenção Ortográfica da Língua Mirandesa** (1999,
# Anstituto de la Lhéngua Mirandesa / Câmara Municipal de Miranda do Douro),
# which is the only codified orthography Mirandese has. Its conventions are
# followed here: «lh-» for initial l, «nh-» for initial n where the convention
# writes it, «ç» where Portuguese writes s or c, «-aç/-oç» finals, «y» in «ye»
# (*is*). Digits are **Latin** (`1`, `2`, `1,234`), which is what DoenetML pins
# for every locale in `src/intl.ts`.
#
# **What is Mirandese here, and where the seed leans on Portuguese.** The frame
# is Mirandese and it is used consistently: «ye» / «nun ye» for *is* / *is
# not*, «nun» negating, «i» for *and*, «ó» for *or*, «se» for *if*, «senó» for
# *otherwise*, «cun» for *with*, «sin» for *without*, «para» for *for*,
# «puis» / «porque» for *because*, «an beç desso» for *instead*. «repuosta»,
# «cierto», «errado», «lhinha», «páigina», «filera», «abiso», «achado»,
# «amostrar», «sconder», «tirar», «acrecentar», «carrega» and «ber» are
# Mirandese, not Portuguese.
#
# **But the technical layer leans on Portuguese, and that is stated rather than
# disguised.** Mirandese has no computing or mathematical terminology of its
# own; every Mirandese speaker is schooled in Portuguese and reads a screen in
# it. So «teclado», «documento», «renderizador», «matemática», «acessibilidade»,
# «statísticas», «rótulo», «coluna», «matriz» and «bariante» are Portuguese
# words, given Mirandese spelling where the Convenção supplies one
# («acessibilidade» keeps its Portuguese shape; «anformaçon», «spresson»,
# «pré-besualizaçon» and «biolaçon» take the Mirandese `-on` for Portuguese
# `-ão` and the initial `an-`/`s-` the convention prescribes). Where a word is
# Portuguese it is Portuguese; nothing has been coined.
#
# **Counts.** CLDR has **no plural data for `mwl`**, so `Intl.PluralRules`
# resolves the tag against the runtime's own locale and any `[one]` branch
# would be selected by somebody else's rules. **No `[zero]`, `[one]`, `[two]`,
# `[few]` or `[many]` branch appears anywhere in this catalog**, in any of the
# four files. Every counted message writes one form, phrased so that it reads
# correctly for any count — Mirandese marks plural on the noun with `-s`, as
# Asturian does, and the seed simply uses the plural throughout. The only
# branch on a number left in this file is `attempts-remaining`'s explicit
# `[0]`, which Fluent matches against the number itself rather than against a
# category and is legal in every locale.
#
# **Weakest first.** The line between a Mirandese word and a Portuguese one is
# the thing a reviewing speaker should attack: several words here — «alerta»,
# «disponible», «sugestion», «alternar» — are the seed's guesses at which side
# of that line they fall on.


## Answer submission

answer-checking = A berificar…
answer-submitting = A ambiar…
answer-checking-status = A berificar la repuosta
answer-submitting-status = A ambiar la repuosta
answer-correct = Cierto
answer-incorrect = Errado
answer-response-saved = Repuosta guardada
answer-percent-credit = { $percent }% de crédito
answer-percent-correct = { $percent }% cierto
answer-percent-short = { $percent } %
max-credit-available = Crédito máximo disponible: { $percent }%
# `[0]` is a numeric literal, not a plural category, and stays legal where
# CLDR has no rules for the tag. Everything else is one form.
attempts-remaining =
    { $count ->
        [0] nun sobra niun tento
       *[other] número de tentos que sobran: { $count }
    }
validation-correct = (Cierto)
validation-incorrect = (Errado)
validation-partially-correct = (An parte cierto)
answer-show-responses = Amostrar las repuostas a { $answerId }: { $count }


## Disclosure panels

feedback-heading = Comentairos
collapsible-click-to-open = (carrega para abrir)
collapsible-click-to-close = (carrega para cerrar)
collapsible-initializing = A ampeçar…
footnote-show = Amostrar la nota de rodapie
footnote-hide = Sconder la nota de rodapie
description-more-information = mais anformaçon


## Controls

slider-previous = Anterior
slider-next = Seguinte
keyboard-open = Abrir l teclado
keyboard-close = Cerrar l teclado
choice-input-remove-choice = Tirar { $choice }
matrix-remove-row = Tirar filera
matrix-add-row = Acrecentar filera
matrix-remove-column = Tirar coluna
matrix-add-column = Acrecentar coluna
subset-add-remove-points = Acrecentar/tirar puntos
subset-toggle-points-intervals = Alternar antre puntos i anterbalos
subset-move-points = Mover ls puntos
subset-clear = Lhimpar
# A `box` here is one orbital, drawn as a square: caixa.
orbital-add-row = Acrecentar filera
orbital-remove-row = Tirar filera
orbital-add-box = Acrecentar caixa
orbital-remove-box = Tirar caixa
orbital-add-up-arrow = Acrecentar seta para riba
orbital-add-down-arrow = Acrecentar seta para baixo
orbital-remove-arrow = Tirar seta
orbital-row-label = Rótulo de la filera { $row }
pretzel-answer = Repuosta


## Math input

math-input-preview-region = pré-besualizaçon de la spresson matemática
math-input-preview = Pré-besualizaçon
math-input-invalid-expression = Spresson nun bálida:


## Document status

viewer-initializing = A ampeçar…


## Errors

error-heading = Erro
error-found-at =
    { $span ->
        [line] Achado na lhinha { $startLine }.
       *[lines] Achado nas lhinhas { $startLine }–{ $endLine }.
    }
document-contains-errors = Este documento ten erros!
diagnostic-heading-error = Erro
diagnostic-heading-warning = Abiso
diagnostic-heading-information = Anformaçon
diagnostic-heading-hint = Sugestion
accessibility-heading-level-1 = Biolaçon de acessibilidade WCAG AA
accessibility-heading-level-2 = Alerta de acessibilidade
something-went-wrong = Algo correu mal.
renderer-load-failed = nun fui possible carregar un renderizador. Torna a carregar la páigina, por fabor.
core-start-failed = Nun fui possible ampeçar este documento. Torna a carregar la páigina, por fabor.
core-start-failed-busy = Nun fui possible ampeçar este documento. Muitos documentos stában a ampeçar al mesmo tiempo, i esso puode demorar mais nun aparelho lento. Tornar a carregar la páigina puode ajudar assi que ls outros documentos acabaren.
core-start-failed-retry = Nun fui possible ampeçar este documento.
core-start-failed-busy-retry = Nun fui possible ampeçar este documento. Muitos documentos stában a ampeçar al mesmo tiempo, i esso puode demorar mais nun aparelho lento.
core-start-retry = Tentar outra beç
saved-state-unavailable = Nun fui possible carregar l tou trabalho guardado.
