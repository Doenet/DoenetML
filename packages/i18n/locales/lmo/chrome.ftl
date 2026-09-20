# Lombard (lombard) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and orthography.** Latin script. This catalog writes **Western
# Lombard, in its Milanese form, in the classical Milanese orthography** — the
# spelling of Cherubini's «Vocabolario Milanese-Italiano» and of the Circolo
# Filologico Milanese, which is what Milanese publishing has used for two
# centuries. **Eastern Lombard (Bergamasque, Brescian) would differ** in
# almost every line of this file, in the sound and in the spelling both:
# «l'è» against «l'è» but «pussee» against «piö», «oeu» against «ö». It is one
# language tag over a wide spread, and a deployment that wants an Eastern
# catalog supplies its own as `localeResources` — the trade `locales/sc` and
# `locales/rm` already record. Correcting this file toward Bergamasque
# sentence by sentence would leave it in two orthographies at once.
#
# Four things in the classical spelling are letters rather than decoration:
#   * **«oeu»** writes the rounded front vowel — «coeur», «voeuja», «bloeu» —
#     and is one sound, never «o» plus «eu»;
#   * **«o»** writes /u/ («mond», «ton», «pont») and **«u»** writes /y/
#     («mur», «luna»), which is the opposite of the Italian value and the
#     single most misread thing in Milanese text;
#   * **«ò»** and **«ó»** are different vowels and distinguish words;
#   * **«s'c»** is two sounds and is never respelled «sc».
# A corrector who "italianizes" these is writing different words. Digits render
# in Latin numerals in every locale, so any digit inside prose here is Latin.
#
# **What is Lombard's own and what is borrowed.** The connectives, the
# everyday verbs and the button words are Milanese and are what makes these
# lines Lombard rather than Italian in Lombard spelling: «l'è» / «hinn» for the
# copula, the postverbal negator **«minga»** («l'è minga valid», «se pò
# minga»), «gh'è» for *there is*, «schiscia» for *press*, «gionta» / «cava»
# for *add* / *remove*, «verz» / «serra» for *open* / *close*, «bloeu» for
# *blue*, «erròr» for *error*, «pussee» for *more*, and the first person
# singular in **-i** («controlli», «mandi»), which is Milanese and not Italian.
# The **mathematical and computing nouns** — «vettor», «poligon», «funzion»,
# «matrice», «anteprima», «visualizador» — are the international technical
# register given Milanese phonology and spelling. Lombard has no standardized
# technical terminology of its own and its speakers are schooled in **Italian**,
# so that is the register those nouns come from; naming it is the point of this
# seed rather than something to disguise.
#
# **Counts.** CLDR has **no** plural rules for `lmo`:
# `Intl.PluralRules("lmo")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch in these files would be selected by
# some other language's rules. **None appears anywhere.** `[one]`/`*[other]`
# is kept, and only that, because the split the fallback happens to make — 1
# against everything else — is the split Milanese needs too: the feminine
# plural is a real ending here («la risposta» → «i rispost»), and where the
# masculine noun is invariable the verb beside it is not («el resta» / «hinn»).
# `[0]` is matched against the number itself, not against a category, and so
# stays legal.
#
# **Weakest first.** A reviewer should attack (1) the imperatives —
# «schiscia», «gionta», «cava», «verz», «nettapulì», and above all «movent»,
# which is a gerund standing where the others are imperatives — and (2) any sentence
# where an Italian frame has survived under Milanese words: if it has no
# «minga», no «gh'è» and no clitic, it is probably still Italian.


## Answer submission

answer-checking = Controlli…
answer-submitting = Mandi…
answer-checking-status = Controlli la risposta
answer-submitting-status = Mandi la risposta
answer-correct = Giust
answer-incorrect = Sbagliaa
answer-response-saved = Risposta salvada
answer-percent-credit = { $percent }% de pont
answer-percent-correct = { $percent }% giust
answer-percent-short = { $percent } %
max-credit-available = Pont massim che se pò ciappà: { $percent }%
attempts-remaining =
    { $count ->
        [0] nissun tentativ che resta
        [one] { $count } tentativ che resta
       *[other] { $count } tentativ che restan
    }
validation-correct = (Giust)
validation-incorrect = (Sbagliaa)
validation-partially-correct = (In part giust)
answer-show-responses =
    { $count ->
        [one] Mostra { $count } risposta a { $answerId }
       *[other] Mostra { $count } rispost a { $answerId }
    }

## Disclosure panels

feedback-heading = Coment
collapsible-click-to-open = (schiscia per verz)
collapsible-click-to-close = (schiscia per serrà)
collapsible-initializing = Se met in moviment…
footnote-show = Mostra la nota a pé de pagina
footnote-hide = Sconda la nota a pé de pagina
description-more-information = pussee informazion

## Controls

slider-previous = Prima
slider-next = Dopo
keyboard-open = Verz la tastiera
keyboard-close = Serra la tastiera
choice-input-remove-choice = Cava { $choice }
matrix-remove-row = Cava ona riga
matrix-add-row = Gionta ona riga
matrix-remove-column = Cava ona colonna
matrix-add-column = Gionta ona colonna
subset-add-remove-points = Gionta / cava pont
subset-toggle-points-intervals = Cambia tra pont e interval
subset-move-points = Movent i pont
subset-clear = Nettapulì
orbital-add-row = Gionta ona riga
orbital-remove-row = Cava ona riga
orbital-add-box = Gionta ona casella
orbital-remove-box = Cava ona casella
orbital-add-up-arrow = Gionta ona frecia in sù
orbital-add-down-arrow = Gionta ona frecia in giò
orbital-remove-arrow = Cava la frecia
orbital-row-label = Etichetta per la riga { $row }
pretzel-answer = Risposta

## Math input

math-input-preview-region = anteprima de l'espression matematica
math-input-preview = Anteprima
math-input-invalid-expression = Espression minga valida:

## Document status

viewer-initializing = Se met in moviment…

## Errors

error-heading = Erròr
error-found-at =
    { $span ->
        [line] Trovaa in la riga { $startLine }.
       *[lines] Trovaa in li righ { $startLine }–{ $endLine }.
    }
document-contains-errors = Chest document el gh'ha denter di erròr!
diagnostic-heading-error = Erròr
diagnostic-heading-warning = Avis
diagnostic-heading-information = Informazion
diagnostic-heading-hint = Sugeriment
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Violazion de accessibilitaa WCAG AA
accessibility-heading-level-2 = Avis de accessibilitaa
something-went-wrong = Quaicoss l'è andaa stort.
renderer-load-failed = on modul de visualizazion el s'è minga cargaa. Torna a cargà la pagina.
core-start-failed = Se pò minga fà partì chest document. Torna a cargà la pagina.
core-start-failed-busy = Se pò minga fà partì chest document. Pussee document partiven insemma, e su ona machina pussee lenta chest el pò trà pussee a longh. Tornà a cargà la pagina el pò iutà quand che i alter document hann finii.
core-start-failed-retry = Se pò minga fà partì chest document.
core-start-failed-busy-retry = Se pò minga fà partì chest document. Pussee document partiven insemma, e su ona machina pussee lenta chest el pò trà pussee a longh.
core-start-retry = Prova amò
saved-state-unavailable = Se pò minga cargà el tò laurà salvaa.
