# Venetian (veneto) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Venetian has several competing spellings and this file picks
# one and stays in it: the **unified Venetian spelling** — «x» for the voiced
# sibilant («xe», «cuxina»), «s» for the voiceless one, and **no «ł»**. The
# evanescent L is written as a plain «l»: «la», «linea», «tabela», not «ła»,
# «łinea», «tabeła». A file with both conventions in it would be wrong in both,
# so a corrector who prefers the «ł» spelling should change the whole file or
# supply their own catalog as `localeResources` — the trade `locales/sc` and
# `locales/rm` already record for a written standard over a spread of
# varieties.
#
# **This is the central koine**, not Venexian specifically, not Trevisan, not
# the Veronese varieties.
#
# **Number, and the category that only fires at a million.** CLDR has plural
# rules for `vec`, and they are the interesting ones of this batch: besides
# `one` and `other` there is a **`many`**, and it selects only at exact
# millions — `Intl.PluralRules("vec").select(1000000)` is `many` while
# `1500000` is `other`. No noun counted in these catalogs changes shape there,
# so no `[many]` branch is written anywhere; it is recorded here so that a
# later reader does not take its absence for an oversight. `chrome.test.ts`
# pins that `vec` has the category and that no catalog writes it.


## Answer submission

answer-checking = Controlo…
answer-submitting = Mando…
answer-checking-status = Controlo la rispota
answer-submitting-status = Mando la rispota
answer-correct = Giusto
answer-incorrect = Sbaglià
answer-response-saved = Rispota salvà
answer-percent-credit = { $percent }% de punti
answer-percent-correct = { $percent }% giusto
answer-percent-short = { $percent } %
max-credit-available = Masimo de punti che se pol ciapar: { $percent }%
attempts-remaining =
    { $count ->
        [0] nisun tentativo che resta
        [one] { $count } tentativo che resta
       *[other] { $count } tentativi che resta
    }
validation-correct = (Giusto)
validation-incorrect = (Sbaglià)
validation-partially-correct = (In parte giusto)
answer-show-responses =
    { $count ->
        [one] Mostra { $count } rispota a { $answerId }
       *[other] Mostra { $count } rispote a { $answerId }
    }

## Disclosure panels

feedback-heading = Comento
collapsible-click-to-open = (struca par verxer)
collapsible-click-to-close = (struca par serar)
collapsible-initializing = Se scomisia…
footnote-show = Mostra la nota
footnote-hide = Scondi la nota
description-more-information = altre informasion

## Controls

slider-previous = Precedente
slider-next = Prosimo
keyboard-open = Verxi la tastiera
keyboard-close = Sera la tastiera
choice-input-remove-choice = Cava { $choice }
matrix-remove-row = Cava na riga
matrix-add-row = Zonta na riga
matrix-remove-column = Cava na colona
matrix-add-column = Zonta na colona
subset-add-remove-points = Zonta / cava punti
subset-toggle-points-intervals = Canbia tra punti e intervai
subset-move-points = Movi i punti
subset-clear = Neta
orbital-add-row = Zonta na riga
orbital-remove-row = Cava na riga
orbital-add-box = Zonta na caxela
orbital-remove-box = Cava na caxela
orbital-add-up-arrow = Zonta na frecia in su
orbital-add-down-arrow = Zonta na frecia in zo
orbital-remove-arrow = Cava la frecia
orbital-row-label = Eticheta par la riga { $row }
pretzel-answer = Rispota

## Math input

math-input-preview-region = anteprima de la espresion matematica
math-input-preview = Anteprima
math-input-invalid-expression = Espresion mia valida:

## Document status

viewer-initializing = Se scomisia…

## Errors

error-heading = Eror
error-found-at =
    { $span ->
        [line] Trovà in te la riga { $startLine }.
       *[lines] Trovà in te le righe { $startLine }–{ $endLine }.
    }
document-contains-errors = Sto documento el ga rentro dei erori!
diagnostic-heading-error = Eror
diagnostic-heading-warning = Avertimento
diagnostic-heading-information = Informasion
diagnostic-heading-hint = Sugerimento
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Violasion de acesibilità WCAG AA
accessibility-heading-level-2 = Aviso de acesibilità
something-went-wrong = Qualcosa la xe ndà storta.
renderer-load-failed = un modulo de vixualixasion no se ga carigà. Torna a carigar la pagina.
core-start-failed = No se ga podesto scominsiar sto documento. Torna a carigar la pagina.
core-start-failed-busy = No se ga podesto scominsiar sto documento. Pì documenti i scominsiava tuti insieme, e su na machina pì lenta el pol tirar pì a longo. Tornar a carigar la pagina el pol jutar quando che i altri documenti i ga finio.
core-start-failed-retry = No se ga podesto scominsiar sto documento.
core-start-failed-busy-retry = No se ga podesto scominsiar sto documento. Pì documenti i scominsiava tuti insieme, e su na machina pì lenta el pol tirar pì a longo.
core-start-retry = Prova da novo
saved-state-unavailable = No se ga podesto carigar el to laoro salvà.
