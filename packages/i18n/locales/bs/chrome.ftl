# Bosnian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Bosnian counts in three plural categories — `one`, `few` and `other` — so
# every `{ $count -> … }` below has three branches where English has two. `few`
# covers 2 to 4 and takes the genitive singular («2 pokušaja»); `other` covers
# 5 and up and the teens, and takes the genitive plural («5 pokušaja», spelled
# alike but a different form).
#
# `one` catches 21 and 101 as well as 1, and misses 11, which is why the
# wording for zero is spelled out in `[0]` rather than left to a category.
#
# Register: the second-person plural imperative — «Ponovo učitajte stranicu».


## Answer submission

answer-checking = Provjera…
answer-submitting = Slanje…
answer-checking-status = Provjera odgovora
answer-submitting-status = Slanje odgovora
answer-correct = Tačno
answer-incorrect = Netačno
answer-response-saved = Odgovor je sačuvan
answer-percent-credit = { $percent }% bodova
answer-percent-correct = { $percent }% tačno
answer-percent-short = { $percent } %
max-credit-available = Najviše mogućih bodova: { $percent }%
attempts-remaining =
    { $count ->
        [0] nema više pokušaja
        [one] preostaje { $count } pokušaj
        [few] preostaju { $count } pokušaja
       *[other] preostaje { $count } pokušaja
    }
validation-correct = (Tačno)
validation-incorrect = (Netačno)
validation-partially-correct = (Djelimično tačno)
answer-show-responses =
    { $count ->
        [one] Prikaži { $count } odgovor na { $answerId }
        [few] Prikaži { $count } odgovora na { $answerId }
       *[other] Prikaži { $count } odgovora na { $answerId }
    }

## Disclosure panels

feedback-heading = Povratna informacija
collapsible-click-to-open = (kliknite za otvaranje)
collapsible-click-to-close = (kliknite za zatvaranje)
collapsible-initializing = Pokretanje…
footnote-show = Prikaži fusnotu
footnote-hide = Sakrij fusnotu
description-more-information = više informacija

## Controls

slider-previous = Nazad
slider-next = Naprijed
keyboard-open = Otvori tastaturu
keyboard-close = Zatvori tastaturu
choice-input-remove-choice = Ukloni { $choice }
matrix-remove-row = Ukloni red
matrix-add-row = Dodaj red
matrix-remove-column = Ukloni kolonu
matrix-add-column = Dodaj kolonu
subset-add-remove-points = Dodaj/ukloni tačke
subset-toggle-points-intervals = Prebaci između tačaka i intervala
subset-move-points = Pomjeri tačke
subset-clear = Očisti
orbital-add-row = Dodaj red
orbital-remove-row = Ukloni red
orbital-add-box = Dodaj okvir
orbital-remove-box = Ukloni okvir
orbital-add-up-arrow = Dodaj strelicu nagore
orbital-add-down-arrow = Dodaj strelicu nadolje
orbital-remove-arrow = Ukloni strelicu
orbital-row-label = Oznaka za red { $row }
pretzel-answer = Odgovor

## Math input

math-input-preview-region = pregled matematičkog izraza
math-input-preview = Pregled
math-input-invalid-expression = Neispravan izraz:

## Document status

viewer-initializing = Pokretanje…

## Errors

error-heading = Greška
error-found-at =
    { $span ->
        [line] Pronađena u redu { $startLine }.
       *[lines] Pronađena u redovima { $startLine }–{ $endLine }.
    }
document-contains-errors = Ovaj dokument sadrži greške!
diagnostic-heading-error = Greška
diagnostic-heading-warning = Upozorenje
diagnostic-heading-information = Informacija
diagnostic-heading-hint = Savjet
accessibility-heading-level-1 = Kršenje pristupačnosti prema WCAG AA
accessibility-heading-level-2 = Upozorenje o pristupačnosti
something-went-wrong = Nešto je pošlo po zlu.
renderer-load-failed = modul za prikaz nije se uspio učitati. Ponovo učitajte stranicu.
core-start-failed = Pregledač dokumenta nije se mogao pokrenuti. Ponovo učitajte stranicu.
