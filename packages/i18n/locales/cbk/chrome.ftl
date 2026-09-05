# Chavacano (Chabacano de Zamboanga) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This is Zamboangueño, and it is a creole, not a variety of Spanish.**
# `cbk` covers several Chabacano varieties, and they are not interchangeable:
# Zamboangueño, of Zamboanga City and Basilan, is much the largest and the one
# still acquired by children, and it is what this catalog is written in.
# A **Caviteño** or **Ternateño** reader will differ from these files in
# vocabulary, in some of the particles, and in the shape of the pronouns —
# those are different Chabacano, not corrections to this one, and a reviewer
# who speaks them should say which variety they are correcting from.
#
# The lexicon below is Spanish and the grammar is Philippine. Nothing here is
# Spanish that has been left half-translated:
#
#   - Aspect is carried by **preverbal particles**, not by conjugation: «ya»
#     for a completed action, «ta» for an ongoing or habitual one, «ay» for
#     one still to come. The verb itself never inflects — it is Spanish's bare
#     stem, «ta manda», «ya principia».
#   - Negation is **«hende»** before a non-past or an adjective, **«no hay»**
#     for 'there is none', and **«nunca»** for a refused future. Spanish's «no»
#     is not the general negator here.
#   - **«el»** is the article, **«maga»** the plural word (from Tagalog «mga»),
#     **«con»** the object marker and **«na»** the general locative — 'in',
#     'on', 'at' and 'to' all at once, which no Spanish preposition does.
#   - **The describing word comes before the noun**, as in every Philippine
#     language and unlike Spanish: «rojo linea», not «linea roja». That is the
#     single thing about these files most likely to look like an error to a
#     reader who reads the vocabulary as Spanish, and `content.ftl` holds to it
#     everywhere.
#
# **Orthography: the traditional Spanish-based spelling**, which is what most
# printed Chavacano uses — «que», «ciudad», «poligono», «circulo». The
# competing system is the **phonemic orthography promoted in Zamboanga City**,
# which writes «ke», «siudad», «poligono», «sirkulo» on Filipino letter values.
# A reviewer who prefers it should **respell rather than retranslate**: the two
# differ by a letter-for-letter mapping and no word choice below depends on
# which is used. Respell all four files at once or none.
#
# **Accents are not written.** Spanish's «á é í ó ú» are dropped throughout —
# «mas», «poligono», «region» — which is ordinary Chavacano practice and a
# checkable claim: there should be no acute accent anywhere in these four
# files.
#
# **The technical register.** Zamboangueño speakers are schooled in English
# and Filipino, and the classroom vocabulary for mathematics is English on top
# of the Spanish the language already carries. Where a Spanish-lexifier word
# is the one in use — «linea», «punto», «circulo», «poligono», «cuadrado»,
# «fila», «columna», «estadistica» — it is used. Where it is not, the English
# word is kept outright (`WCAG`, `renderer`, `reload`, `teclado`'s neighbours
# in `editor.ftl`) rather than coined.

answer-checking = Ta revisa...
answer-submitting = Ta manda...

answer-checking-status = Ta revisa el respuesta
answer-submitting-status = Ta manda el respuesta

answer-correct = Correcto
answer-incorrect = Incorrecto

answer-response-saved = Guardao el Respuesta

answer-percent-credit = { $percent }% Credito
answer-percent-correct = { $percent }% Correcto
answer-percent-short = { $percent } %

max-credit-available = Maximo credito puede consigui: { $percent }%

attempts-remaining =
    { $count ->
        [0] no hay ya intento que sobra
       *[other] { $count } intento pa el sobra
    }

validation-correct = (Correcto)
validation-incorrect = (Incorrecto)
validation-partially-correct = (Parcialmente correcto)

answer-show-responses =
    { $count ->
       *[other] Mostra el { $count } respuesta con { $answerId }
    }

feedback-heading = Comentario

collapsible-click-to-open = (click para abri)
collapsible-click-to-close = (click para cerra)

collapsible-initializing = Ta principia...

footnote-show = Mostra el nota na pie
footnote-hide = Esconde el nota na pie

description-more-information = mas informacion

slider-previous = Antes
slider-next = Siguiente

keyboard-open = Abri el Teclado
keyboard-close = Cerra el Teclado

choice-input-remove-choice = Quita el { $choice }

matrix-remove-row = Quita el fila
matrix-add-row = Agrega un fila
matrix-remove-column = Quita el columna
matrix-add-column = Agrega un columna

subset-add-remove-points = Agrega/Quita maga punto
subset-toggle-points-intervals = Cambia entre maga punto y maga intervalo
subset-move-points = Mueve el maga punto
subset-clear = Limpia

orbital-add-row = Agrega un fila
orbital-remove-row = Quita el fila
orbital-add-box = Agrega un caja
orbital-remove-box = Quita el caja
orbital-add-up-arrow = Agrega un flecha para arriba
orbital-add-down-arrow = Agrega un flecha para abajo
orbital-remove-arrow = Quita el flecha

orbital-row-label = Letrero para na fila { $row }

pretzel-answer = Respuesta


math-input-preview-region = vista previa del matematico expresion
math-input-preview = Vista previa
math-input-invalid-expression = Invalido expresion:

viewer-initializing = Ta principia...

error-heading = Error

error-found-at =
    { $span ->
        [line] Encontrao na linea { $startLine }.
       *[lines] Encontrao na maga linea { $startLine }–{ $endLine }.
    }

document-contains-errors = Tiene error este documento!

diagnostic-heading-error = Error
diagnostic-heading-warning = Aviso
diagnostic-heading-information = Informacion
diagnostic-heading-hint = Consejo

accessibility-heading-level-1 = Violacion na Accesibilidad WCAG AA
accessibility-heading-level-2 = Aviso de accesibilidad

something-went-wrong = Tiene cosa ya sale mal.

renderer-load-failed = hende ya puede carga un renderer. Favor recarga el pagina.

core-start-failed = Hende puede principia este documento. Favor recarga el pagina.

core-start-failed-busy = Hende puede principia este documento. Muchos documento ya principia junto, y mas largo ese si mas lento el aparato. Puede ayuda el recarga del pagina si acaba ya el otro maga documento.

core-start-failed-retry = Hende puede principia este documento.

core-start-failed-busy-retry = Hende puede principia este documento. Muchos documento ya principia junto, y mas largo ese si mas lento el aparato.

core-start-retry = Intenta otra vez

saved-state-unavailable = Hende puede carga el guardao de tuyo trabajo.
