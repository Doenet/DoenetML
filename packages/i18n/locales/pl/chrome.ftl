# Polish viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Polish has four plural categories — `one`, `few`, `many` and `other` — and
# every message here that prints a count beside a noun selects on all of them.
# `few` covers 2–4 and any count ending in 2–4 except the teens; `many` covers
# the rest, including 0. `other` catches the fractional values CLDR routes
# there.
#
# Controls take the bare imperative, which is what Polish puts on a button:
# `Otwórz klawiaturę`, not `Proszę otworzyć klawiaturę`.


## Answer submission

answer-checking = Sprawdzanie...
answer-submitting = Wysyłanie...
answer-checking-status = Sprawdzanie odpowiedzi
answer-submitting-status = Wysyłanie odpowiedzi
answer-correct = Poprawnie
answer-incorrect = Niepoprawnie
answer-response-saved = Odpowiedź zapisana
answer-percent-credit = { $percent }% punktów
answer-percent-correct = { $percent }% poprawnie
answer-percent-short = { $percent }%
max-credit-available = Maksymalny dostępny wynik: { $percent }%
attempts-remaining =
    { $count ->
        [0] brak pozostałych prób
        [one] pozostała { $count } próba
        [few] pozostały { $count } próby
        [many] pozostało { $count } prób
       *[other] pozostało { $count } próby
    }
validation-correct = (Poprawnie)
validation-incorrect = (Niepoprawnie)
validation-partially-correct = (Częściowo poprawnie)
answer-show-responses =
    { $count ->
        [one] Pokaż { $count } odpowiedź na { $answerId }
        [few] Pokaż { $count } odpowiedzi na { $answerId }
        [many] Pokaż { $count } odpowiedzi na { $answerId }
       *[other] Pokaż { $count } odpowiedzi na { $answerId }
    }

## Disclosure panels

feedback-heading = Informacja zwrotna
collapsible-click-to-open = (kliknij, aby otworzyć)
collapsible-click-to-close = (kliknij, aby zamknąć)
collapsible-initializing = Inicjowanie...
footnote-show = Pokaż przypis
footnote-hide = Ukryj przypis
description-more-information = więcej informacji

## Controls

slider-previous = Poprzedni
slider-next = Następny
keyboard-open = Otwórz klawiaturę
keyboard-close = Zamknij klawiaturę
choice-input-remove-choice = Usuń { $choice }
matrix-remove-row = Usuń wiersz
matrix-add-row = Dodaj wiersz
matrix-remove-column = Usuń kolumnę
matrix-add-column = Dodaj kolumnę
subset-add-remove-points = Dodaj/usuń punkty
subset-toggle-points-intervals = Przełącz punkty i przedziały
subset-move-points = Przesuń punkty
subset-clear = Wyczyść
# A `box` here is one orbital, drawn as a square: klatka.
orbital-add-row = Dodaj wiersz
orbital-remove-row = Usuń wiersz
orbital-add-box = Dodaj klatkę
orbital-remove-box = Usuń klatkę
orbital-add-up-arrow = Dodaj strzałkę w górę
orbital-add-down-arrow = Dodaj strzałkę w dół
orbital-remove-arrow = Usuń strzałkę
orbital-row-label = Etykieta wiersza { $row }
pretzel-answer = Odpowiedź

## Math input

math-input-preview-region = podgląd wyrażenia matematycznego
math-input-preview = Podgląd
math-input-invalid-expression = Nieprawidłowe wyrażenie:

## Document status

viewer-initializing = Inicjowanie...

## Errors

error-heading = Błąd
error-found-at =
    { $span ->
        [line] Znaleziono w wierszu { $startLine }.
       *[lines] Znaleziono w wierszach { $startLine }–{ $endLine }.
    }
document-contains-errors = Ten dokument zawiera błędy!
diagnostic-heading-error = Błąd
diagnostic-heading-warning = Ostrzeżenie
diagnostic-heading-information = Informacja
diagnostic-heading-hint = Wskazówka
accessibility-heading-level-1 = Naruszenie dostępności WCAG AA
accessibility-heading-level-2 = Ostrzeżenie o dostępności
something-went-wrong = Coś poszło nie tak.
renderer-load-failed = nie udało się wczytać komponentu renderującego. Odśwież stronę.
core-start-failed = Nie udało się uruchomić przeglądarki dokumentu. Odśwież stronę.
