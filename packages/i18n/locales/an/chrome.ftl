# Aragonese (aragonés) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script, in the **Academia de l'Aragonés /
# EFA** standard — the *Propuesta ortografica de l'Academia de l'Aragonés*
# (2010) — and not the Uesca 1987 grafía. The two differ visibly and this file
# is consistently in the first: ⟨ny⟩ and never ⟨ñ⟩ («anyo», «senyal»),
# etymological ⟨v⟩ («valor», «vista», not «balor», «bista»), ⟨qu⟩ and ⟨c⟩ kept
# where Latin had them, and final ⟨-t⟩ in «puet», «tien», «cantidat». A
# corrector who works in the Uesca grafía should convert the whole file rather
# than a line of it; a mixture would be wrong in both.
#
# The articles are the Academia's **o / a / os / as**, contracting after «de»
# and «a»: «d'o», «d'a», «d'os», «d'as».
#
# **Accents are half-applied, and that is a gap rather than a convention.**
# The Academia accents proparoxytones as Spanish does. This file accents the
# oxytones — «función», «espresión», «sección», «vulneración», «tamién» — and
# never a proparoxytone: «numero», «indices», «valido», «matematica»,
# «parabola», «pachina» and «poligono» are all written bare, in some cases
# dozens of times. Accenting them is the single most mechanical correction a
# speaker could make to this catalog.
#
# **What is Aragonese here and what is borrowed.** The copula «ye» (is) and
# «son», the verb forms «puet», «tien», «cal» (must), «fa», the conjunction
# «u» for *or*, the negator «no», the participles in **-au / -ada»
# («trobau», «especificau», «puntiada»), and the everyday verbs «amostrar»,
# «amagar», «ubrir», «zarrar», «adhibir», «sacar», «ninviar», «comprebar» are
# Aragonese and are what should make this recognisable. The colour words
# «royo», «amariello», «morau» are Aragonese too. The technical nouns —
# «component», «atributo», «documento», «matriz», «estadisticas» — are the
# learned Romance layer, which in practice reaches an Aragonese speaker
# through **Spanish**, the language secondary school in Aragón is taught in;
# they are not disguised as anything else. `WCAG AA` and `DoenetML` are names
# and stay in English.
#
# **Counts.** CLDR *does* have plural rules for `an`, with the two categories
# `one` and `other`, so an `[one]` / `*[other]` select here is genuinely
# selected by Aragonese rules and is written wherever English writes one. As in
# Spanish, `one` does not catch zero, so the wording for none is spelled out in
# a numeric `[0]` branch.
#
# **Numbers** render in Latin digits everywhere, which is what Aragonese uses.
#
# **Weakest first.** The button verbs are the guesses most worth attacking:
# «comprebar» for *check work*, «ninviar» for *submit*, «adhibir» for *add* and
# «sacar» for *remove* were chosen from the dictionaries rather than from usage
# in a piece of software, and no Aragonese software register exists to check
# them against.


## Answer submission

answer-checking = Comprebando…
answer-submitting = Ninviando…
answer-checking-status = Comprebando a respuesta
answer-submitting-status = Ninviando a respuesta
answer-correct = Correcto
answer-incorrect = Incorrecto
answer-response-saved = Respuesta alzada
answer-percent-credit = { $percent }% d'os puntos
answer-percent-correct = { $percent }% correcto
answer-percent-short = { $percent } %
max-credit-available = Puntos masimos disponibles: { $percent }%
attempts-remaining =
    { $count ->
        [0] no i queda garra intento
        [one] queda { $count } intento
       *[other] quedan { $count } intentos
    }
validation-correct = (Correcto)
validation-incorrect = (Incorrecto)
validation-partially-correct = (Parcialment correcto)
answer-show-responses =
    { $count ->
        [one] Amostrar { $count } respuesta a { $answerId }
       *[other] Amostrar { $count } respuestas a { $answerId }
    }

## Disclosure panels

feedback-heading = Comentario
collapsible-click-to-open = (fe clic ta ubrir)
collapsible-click-to-close = (fe clic ta zarrar)
collapsible-initializing = Encetando…
footnote-show = Amostrar a nota
footnote-hide = Amagar a nota
description-more-information = mas información

## Controls

slider-previous = Anterior
slider-next = Siguient
keyboard-open = Ubrir o teclau
keyboard-close = Zarrar o teclau
choice-input-remove-choice = Sacar { $choice }
matrix-remove-row = Sacar una ringlera
matrix-add-row = Adhibir una ringlera
matrix-remove-column = Sacar una columna
matrix-add-column = Adhibir una columna
subset-add-remove-points = Adhibir/sacar puntos
subset-toggle-points-intervals = Cambiar entre puntos y intervalos
subset-move-points = Mover os puntos
subset-clear = Limpiar
orbital-add-row = Adhibir una ringlera
orbital-remove-row = Sacar una ringlera
orbital-add-box = Adhibir una caixa
orbital-remove-box = Sacar una caixa
orbital-add-up-arrow = Adhibir una flecha enta alto
orbital-add-down-arrow = Adhibir una flecha enta baixo
orbital-remove-arrow = Sacar a flecha
orbital-row-label = Etiqueta d'a ringlera { $row }
pretzel-answer = Respuesta

## Math input

math-input-preview-region = vista previa d'a espresión matematica
math-input-preview = Vista previa
math-input-invalid-expression = Espresión no valida:

## Document status

viewer-initializing = Encetando…

## Errors

error-heading = Error
error-found-at =
    { $span ->
        [line] Trobau en a linia { $startLine }.
       *[lines] Trobau en as linias { $startLine }–{ $endLine }.
    }
document-contains-errors = ¡Iste documento contién errors!
diagnostic-heading-error = Error
diagnostic-heading-warning = Alvertencia
diagnostic-heading-information = Información
diagnostic-heading-hint = Pista
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Vulneración d'accesibilidat WCAG AA
accessibility-heading-level-2 = Aviso d'accesibilidat
something-went-wrong = Bella cosa ha salliu mal.
renderer-load-failed = un modulo de representación no s'ha puesto cargar. Torna a cargar a pachina.
core-start-failed = Iste documento no s'ha puesto encetar. Torna a cargar a pachina.
core-start-failed-busy = Iste documento no s'ha puesto encetar. Cuantos documentos s'encetaban a la vez, y en un aparato mas lento ixo puet tardar mas. Tornar a cargar a pachina puet aduyar una vegada os atros documentos haigan rematau.
core-start-failed-retry = Iste documento no s'ha puesto encetar.
core-start-failed-busy-retry = Iste documento no s'ha puesto encetar. Cuantos documentos s'encetaban a la vez, y en un aparato mas lento ixo puet tardar mas.
core-start-retry = Prebar unatra vez
saved-state-unavailable = O tuyo treballo alzau no s'ha puesto cargar.
