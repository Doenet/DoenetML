# Slovenian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Slovenian counts in four plural categories, `two` among them — only
# `locales/ar` and `locales/he` need that one too. Slovenian has a living dual,
# so two attempts are «2 poskusa» and neither the singular nor any plural will
# do. `few` covers 3 and 4, and `other` everything from 5 up. Every
# `{ $count -> … }` below that prints its number therefore has four branches
# where English has two.
#
# The categories go by the last two digits, so 101 is `one`, 102 is `two` and
# 105 is `other`; zero falls to `other`, which is why the wording for zero is
# spelled out in `[0]`.
#
# Register: the second-person plural imperative — «Znova naložite stran».


## Answer submission

answer-checking = Preverjanje …
answer-submitting = Pošiljanje …
answer-checking-status = Preverjanje odgovora
answer-submitting-status = Pošiljanje odgovora
answer-correct = Pravilno
answer-incorrect = Napačno
answer-response-saved = Odgovor je shranjen
answer-percent-credit = { $percent }% točk
answer-percent-correct = { $percent }% pravilno
answer-percent-short = { $percent } %
max-credit-available = Največ mogočih točk: { $percent }%
attempts-remaining =
    { $count ->
        [0] ni več poskusov
        [one] ostaja { $count } poskus
        [two] ostajata { $count } poskusa
        [few] ostajajo { $count } poskusi
       *[other] ostaja { $count } poskusov
    }
validation-correct = (Pravilno)
validation-incorrect = (Napačno)
validation-partially-correct = (Delno pravilno)
answer-show-responses =
    { $count ->
        [one] Pokaži { $count } odgovor na { $answerId }
        [two] Pokaži { $count } odgovora na { $answerId }
        [few] Pokaži { $count } odgovore na { $answerId }
       *[other] Pokaži { $count } odgovorov na { $answerId }
    }

## Disclosure panels

feedback-heading = Povratna informacija
collapsible-click-to-open = (kliknite za odpiranje)
collapsible-click-to-close = (kliknite za zapiranje)
collapsible-initializing = Zagon …
footnote-show = Pokaži opombo
footnote-hide = Skrij opombo
description-more-information = več informacij

## Controls

slider-previous = Nazaj
slider-next = Naprej
keyboard-open = Odpri tipkovnico
keyboard-close = Zapri tipkovnico
choice-input-remove-choice = Odstrani { $choice }
matrix-remove-row = Odstrani vrstico
matrix-add-row = Dodaj vrstico
matrix-remove-column = Odstrani stolpec
matrix-add-column = Dodaj stolpec
subset-add-remove-points = Dodaj/odstrani točke
subset-toggle-points-intervals = Preklopi med točkami in intervali
subset-move-points = Premakni točke
subset-clear = Počisti
orbital-add-row = Dodaj vrstico
orbital-remove-row = Odstrani vrstico
orbital-add-box = Dodaj polje
orbital-remove-box = Odstrani polje
orbital-add-up-arrow = Dodaj puščico navzgor
orbital-add-down-arrow = Dodaj puščico navzdol
orbital-remove-arrow = Odstrani puščico
orbital-row-label = Oznaka za vrstico { $row }
pretzel-answer = Odgovor

## Math input

math-input-preview-region = predogled matematičnega izraza
math-input-preview = Predogled
math-input-invalid-expression = Neveljaven izraz:

## Document status

viewer-initializing = Zagon …

## Errors

error-heading = Napaka
error-found-at =
    { $span ->
        [line] Najdena v vrstici { $startLine }.
       *[lines] Najdena v vrsticah { $startLine }–{ $endLine }.
    }
document-contains-errors = Ta dokument vsebuje napake!
diagnostic-heading-error = Napaka
diagnostic-heading-warning = Opozorilo
diagnostic-heading-information = Informacija
diagnostic-heading-hint = Namig
accessibility-heading-level-1 = Kršitev dostopnosti po WCAG AA
accessibility-heading-level-2 = Opozorilo o dostopnosti
something-went-wrong = Nekaj je šlo narobe.
renderer-load-failed = modula za izris ni bilo mogoče naložiti. Znova naložite stran.
core-start-failed = Pregledovalnika dokumenta ni bilo mogoče zagnati. Znova naložite stran.
