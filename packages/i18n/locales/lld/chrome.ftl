# Ladin (ladin) viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and standard.** Latin script, and the written form is **Ladin
# Dolomitan** (ladin standard / ladin dolomitan) — the koine the Servisc de
# Planificazion y Elaborazion dl Lingaz Ladin (SPELL) elaborated and published
# in the «Gramatica dl Ladin Standard» (2001) and the «Dizionar dl Ladin
# Standard» (2002), issued by the Istitut Cultural Ladin and the Union
# Generela di Ladins dles Dolomites. It is a standard **over** the valley
# varieties and is not any one of them: Gherdëina (Val Gardena), Badiot (Val
# Badia) and Fascian (Val di Fassa) all differ from it in the everyday word,
# and so do Fodom and Anpezan. A deployment that wants one supplies its own
# catalog as `localeResources` — the trade `locales/sc` and `locales/rm`
# already record. Correcting this file toward Gherdëina sentence by sentence
# would leave it in two standards at once.
#
# Three things in the spelling are letters rather than decoration: **«ë»** is a
# vowel of its own (Gherdëina, cësa, plajëi) and is never a plain «e»; **«z»**
# writes the affricate (zircul, azessibilité) and is not an «s»; and **«j»**
# writes the voiced palatal (jì, plajëi). Digits render in Latin numerals in
# every locale, so any digit written inside prose here is a Latin digit too.
#
# **What is Ladin's own and what is borrowed.** The connectives and the
# everyday verbs are Ladin and are what makes these lines Ladin rather than
# Italian: «y» for *and* (not «e»), «sce» for *if*, «nia» for the negator,
# «zeche» for *something*, «l é» / «i é» for the copula, «jì» for *to go*,
# «tò demez» for *to remove*, «njunté» for *to add*, «daurì» / «stlù» for
# *open* / *close*, «plata» for *page*, «fal» for *error*, «lëur» for *work*.
# Ladin has a real elaboration tradition behind it — SPELL's dictionary and
# grammar, plus the terminology the Province and the Ladin school
# administration publish for administrative and school use — so the school
# vocabulary here («resposta», «tentatif», «esercizi», «etichëta») is Ladin's
# own rather than borrowed word for word. The **mathematical and computing
# nouns** are a different matter: «vetor», «poligon», «funzion», «matriza»,
# «anteprima» are the international technical register given Ladin phonology
# and spelling, which is what SPELL's own dictionary does with them, and
# «clica» (click) is a plain borrowing. Naming that honestly is the point of
# this seed.
#
# **Counts.** CLDR **does** have rules for `lld`. It declares `one`, `many` and
# `other`. `one` is 1 and `many` is reached only by an exact whole multiple of
# a million — 1000000, 2000000, … — which is the Italian-style rule for the
# compact «un milion» forms; every other count this software formats is
# `other`. So this catalog writes `[one]` and `*[other]` where English selects
# on a count and writes **no** `[many]` branch anywhere: nothing here counts
# to a million, and a `[many]` written on that chance would be a branch no
# reader would ever see. `[0]` is matched against the number itself, not a
# category, and stays legal.
#
# **Weakest first.** A reviewer should attack (1) the imperatives — «Mostra»,
# «Nete», «Prova», «Muever» — where the standard's forms are the least secure
# thing in these files; (2) the colour words, «cueci» for red above all; and
# (3) anywhere an Italian frame has survived under Ladin words.


## Answer submission

answer-checking = Do a controlé…
answer-submitting = Do a mané…
answer-checking-status = Do a controlé la resposta
answer-submitting-status = Do a mané la resposta
answer-correct = Just
answer-incorrect = Sbalià
answer-response-saved = Resposta salvada
answer-percent-credit = { $percent }% di ponc
answer-percent-correct = { $percent }% just
answer-percent-short = { $percent } %
max-credit-available = Ponc massimi che se pò giapé: { $percent }%
attempts-remaining =
    { $count ->
        [0] degun tentatif che resta
        [one] { $count } tentatif che resta
       *[other] { $count } tentatifs che resta
    }
validation-correct = (Just)
validation-incorrect = (Sbalià)
validation-partially-correct = (En pert just)
answer-show-responses =
    { $count ->
        [one] Mostra { $count } resposta a { $answerId }
       *[other] Mostra { $count } respostes a { $answerId }
    }

## Disclosure panels

feedback-heading = Coment
collapsible-click-to-open = (clica per daurì)
collapsible-click-to-close = (clica per stlù)
collapsible-initializing = Do a partì…
footnote-show = Mostra la nota a pe de plata
footnote-hide = Scuender la nota a pe de plata
description-more-information = plu enformazions

## Controls

slider-previous = Dant
slider-next = Do
keyboard-open = Daurì la tastiera
keyboard-close = Stlù la tastiera
choice-input-remove-choice = Tò demez { $choice }
matrix-remove-row = Tò demez na linia
matrix-add-row = Njunté na linia
matrix-remove-column = Tò demez na colona
matrix-add-column = Njunté na colona
subset-add-remove-points = Njunté / tò demez ponc
subset-toggle-points-intervals = Mudé danter ponc y intervai
subset-move-points = Muever i ponc
subset-clear = Nete
orbital-add-row = Njunté na linia
orbital-remove-row = Tò demez na linia
orbital-add-box = Njunté na casela
orbital-remove-box = Tò demez na casela
orbital-add-up-arrow = Njunté na frecia en sù
orbital-add-down-arrow = Njunté na frecia en jù
orbital-remove-arrow = Tò demez la frecia
orbital-row-label = Etichëta per la linia { $row }
pretzel-answer = Resposta

## Math input

math-input-preview-region = anteprima dla espression matematica
math-input-preview = Anteprima
math-input-invalid-expression = Espression nia valida:

## Document status

viewer-initializing = Do a partì…

## Errors

error-heading = Fal
error-found-at =
    { $span ->
        [line] Ciatà te la linia { $startLine }.
       *[lines] Ciatà te les linies { $startLine }–{ $endLine }.
    }
document-contains-errors = Chest document à ite di fai!
diagnostic-heading-error = Fal
diagnostic-heading-warning = Avertimënt
diagnostic-heading-information = Enformazion
diagnostic-heading-hint = Consei
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Violazion dla azessibilité WCAG AA
accessibility-heading-level-2 = Avis de azessibilité
something-went-wrong = Zeche é jit stort.
renderer-load-failed = n modul de rapresentazion no s'à nia carià. Carié endò la plata.
core-start-failed = No s'à nia podù enviar chest document. Carié endò la plata.
core-start-failed-busy = No s'à nia podù enviar chest document. Plu documenc se enviava tl medemo momënt, y sun na machina plu lënta chest pò tré plu ora. Carié endò la plata pò jué canche i autri documenc à finì.
core-start-failed-retry = No s'à nia podù enviar chest document.
core-start-failed-busy-retry = No s'à nia podù enviar chest document. Plu documenc se enviava tl medemo momënt, y sun na machina plu lënta chest pò tré plu ora.
core-start-retry = Prova endò
saved-state-unavailable = No s'à nia podù carié l ti lëur salvà.
