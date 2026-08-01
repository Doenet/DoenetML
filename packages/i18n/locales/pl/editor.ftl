# Polish editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Polish counts in four plural categories, and which of them a message needs
# depends on what the count does in it. A message that prints the number next
# to a noun has to agree that noun with it, so it spells out `one`, `few` and
# `many` and lets `*[other]` carry the fractional values CLDR routes there. A
# message where the number never appears — the list messages, whose count only
# decides whether a verb is singular or plural — has just the two forms Polish
# offers there, so `one` and `*[other]` are the whole selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Resetuj
       *[update] Odśwież
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } podgląd
       *[other] { $word } podgląd { $shortcut }
    }


## The variant picker

editor-variant = Wariant
editor-variant-filter = Filtruj...
editor-variant-next = Wybierz następny wariant
editor-variant-previous = Wybierz poprzedni wariant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Wykryto naruszenie dostępności WCAG AA. Kliknij, aby { $action ->
            [close] zamknąć
           *[open] otworzyć
        } raport dostępności.
        [advisories] Kliknij, aby { $action ->
            [close] zamknąć
           *[open] otworzyć
        } raport dostępności. Nie znaleziono naruszeń WCAG AA, ale są dodatkowe zalecenia dotyczące dostępności.
       *[clean] Kliknij, aby { $action ->
            [close] zamknąć
           *[open] otworzyć
        } raport dostępności. Nie znaleziono problemów z dostępnością.
    }

editor-accessibility-label =
    { $status ->
        [violations] Wykryto naruszenie dostępności WCAG AA. Znaleziono { $count ->
            [one] { $count } naruszenie WCAG AA
            [few] { $count } naruszenia WCAG AA
            [many] { $count } naruszeń WCAG AA
           *[other] { $count } naruszenia WCAG AA
        }. Kliknij, aby { $action ->
            [close] zamknąć
           *[open] otworzyć
        } raport dostępności.
        [advisories] Nie wykryto naruszeń WCAG AA. Znaleziono { $count ->
            [one] { $count } dodatkowe zalecenie dotyczące dostępności
            [few] { $count } dodatkowe zalecenia dotyczące dostępności
            [many] { $count } dodatkowych zaleceń dotyczących dostępności
           *[other] { $count } dodatkowego zalecenia dotyczącego dostępności
        }. Kliknij, aby { $action ->
            [close] zamknąć
           *[open] otworzyć
        } raport dostępności.
       *[clean] Nie wykryto naruszeń WCAG AA. Kliknij, aby { $action ->
            [close] zamknąć
           *[open] otworzyć
        } raport dostępności.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML wersja { $version }

editor-tab-help = Pomoc kontekstowa
editor-tab-help-short = Kontekst
editor-tab-errors = Błędy
editor-tab-warnings = Ostrzeżenia
editor-tab-info = Informacje
editor-tab-accessibility = Dostępność
editor-tab-responses = Wysłane odpowiedzi

editor-tab-with-count = { $label }: { $count }

editor-options = Opcje edytora
editor-format-as-doenetml = Formatuj jako DoenetML
editor-format-as-xml = Formatuj jako XML


## The diagnostics panel

editor-diagnostic-line = Wiersz #{ $line }

editor-no-errors = Brak błędów
editor-no-warnings = Brak ostrzeżeń
editor-no-info = Brak diagnostyki informacyjnej

editor-show-info-annotations = Pokaż diagnostykę informacyjną w edytorze
editor-show-accessibility-annotations = Pokaż diagnostykę dostępności w edytorze

editor-accessibility-learn-more = Dowiedz się, jak Doenet podchodzi do dostępności

editor-accessibility-violations-heading = Naruszenia dostępności ({ $standard })

editor-accessibility-other-heading = Inne problemy z dostępnością
editor-none-found = Nic nie znaleziono


## Submitted responses

editor-no-responses = Nie wysłano jeszcze żadnych odpowiedzi
editor-response-answer-id = Id odpowiedzi
editor-response-response = Odpowiedź
editor-response-credit = Punkty
editor-response-submitted = Wysłano


## The context-help panel

help-placeholder = Ustaw kursor na nazwie znacznika, atrybucie lub { $ref }, aby zobaczyć dokumentację.

help-unsupported-ref-chain = Pomoc dla odwołań wieloczłonowych, takich jak { $example }, nie jest jeszcze obsługiwana.

help-unresolved-ref =
    { $reason ->
        [notFound] Nie znaleziono obiektu dla odwołania: { $ref }.
        [multiple] Znaleziono wiele obiektów dla odwołania: { $ref }.
       *[indeterminate] Nie można ustalić obiektu dla { $ref }.
    }

help-learn-about-references = Dowiedz się więcej o odwołaniach →
help-reference-page = Strona referencyjna →

help-suggestions-header =
    { $location ->
        [inside] Wewnątrz { $element }
       *[top] Na najwyższym poziomie
    }{ $allowed ->
        [none] { " — nic tu nie może się znaleźć." }
        [text] { " — można tu wpisać tekst." }
        [text-and-components] { " — można tu wpisać tekst albo spróbować:" }
       *[components] { " — do wypróbowania:" }
    }

help-suggestions-footer = Naciśnij { $shortcut }, aby zobaczyć wszystkie komponenty ({ $total }).

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } to odwołanie do { $target }.
       *[other] { $ref } to odwołanie do { $target } (wiersz { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Wprowadzone przez { $owner } jako { $role }.
       *[other] Wprowadzone przez { $owner } w wierszu { $line } jako { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } to odwołanie do właściwości { $property } elementu { $element }.
       *[other] { $ref } to odwołanie do właściwości { $property } elementu { $element } (wiersz { $line }).
    }

help-kind-attribute = atrybut
help-kind-snippet = fragment kodu
help-kind-array-entry = element tablicy

help-default = Domyślnie:
help-active-default = Obowiązująca wartość domyślna:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Dozwolone wartości (po jednej na element):
       *[other] Dozwolone wartości:
    }

help-suggested-values = Sugerowane wartości:

help-inserts = Wstawia:

help-coordinates =
    { $count ->
        [one] Współrzędna:
       *[other] Współrzędne:
    }

help-type = Typ:

help-resolved-style = Ustalony styl (styleNumber { $styleNumber }):

help-resolved-function-names = Ustalone nazwy funkcji:
help-reset-list = Lista resetowania dla tego pola:
help-added-on-input = Dodane w tym polu:
help-removed-on-input = Usunięte w tym polu:

help-reset-overrides = { $reset } ma pierwszeństwo przed { $additional } i { $removed }.
