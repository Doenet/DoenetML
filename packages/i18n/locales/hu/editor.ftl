# Hungarian editor and language-server surfaces. Translated from
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
# A counted noun stays singular, so where English separates «1 violation» from
# «2 violations» Hungarian writes one form and the select is dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Visszaállítás
       *[update] Frissítés
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Megjelenítő { $word }
       *[other] Megjelenítő { $word } { $shortcut }
    }


## The variant picker

editor-variant = Változat
editor-variant-filter = Szűrő…
editor-variant-next = Következő változat kiválasztása
editor-variant-previous = Előző változat kiválasztása


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA akadálymentességi hibát találtunk. Kattintson az akadálymentességi jelentés { $action ->
            [close] bezárásához
           *[open] megnyitásához
        }.
        [advisories] Kattintson az akadálymentességi jelentés { $action ->
            [close] bezárásához
           *[open] megnyitásához
        }. WCAG AA hibát nem találtunk, de vannak további akadálymentességi javaslatok.
       *[clean] Kattintson az akadálymentességi jelentés { $action ->
            [close] bezárásához
           *[open] megnyitásához
        }. Nem találtunk akadálymentességi problémát.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA akadálymentességi hibát találtunk. { $count } WCAG AA hiba található. Kattintson az akadálymentességi jelentés { $action ->
            [close] bezárásához
           *[open] megnyitásához
        }.
        [advisories] WCAG AA hibát nem találtunk. { $count } további akadálymentességi javaslat található. Kattintson az akadálymentességi jelentés { $action ->
            [close] bezárásához
           *[open] megnyitásához
        }.
       *[clean] WCAG AA hibát nem találtunk. Kattintson az akadálymentességi jelentés { $action ->
            [close] bezárásához
           *[open] megnyitásához
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML { $version } verzió

editor-tab-help = Környezetfüggő súgó
editor-tab-help-short = Környezet
editor-tab-errors = Hibák
editor-tab-warnings = Figyelmeztetések
editor-tab-info = Információ
editor-tab-accessibility = Akadálymentesség
editor-tab-responses = Beküldött válaszok

editor-tab-with-count = { $label }: { $count }

editor-options = Szerkesztő beállításai
editor-format-as-doenetml = Formázás DoenetML-ként
editor-format-as-xml = Formázás XML-ként


## The diagnostics panel

editor-diagnostic-line = { $line }. sor

editor-no-errors = Nincs hiba
editor-no-warnings = Nincs figyelmeztetés
editor-no-info = Nincs információs üzenet

editor-show-info-annotations = Információs üzenetek megjelenítése a szerkesztőben
editor-show-accessibility-annotations = Akadálymentességi üzenetek megjelenítése a szerkesztőben

editor-accessibility-learn-more = Hogyan közelíti meg a Doenet az akadálymentességet

editor-accessibility-violations-heading = Akadálymentességi hibák ({ $standard })

editor-accessibility-other-heading = Egyéb akadálymentességi problémák
editor-none-found = Nincs találat


## Submitted responses

editor-no-responses = Még nincs beküldött válasz
editor-response-answer-id = Válasz azonosítója
editor-response-response = Válasz
editor-response-credit = Pont
editor-response-submitted = Beküldve


## The context-help panel

help-placeholder = A dokumentációhoz vigye a kurzort egy címkenévre, egy attribútumra vagy erre: { $ref }.

help-unsupported-ref-chain = A többtagú hivatkozásokhoz — mint { $example } — még nincs súgó.

help-unresolved-ref =
    { $reason ->
        [notFound] Nem található hivatkozott elem ehhez: { $ref }.
        [multiple] Több hivatkozott elem található ehhez: { $ref }.
       *[indeterminate] A(z) { $ref } hivatkozott eleme nem határozható meg.
    }

help-learn-about-references = Tudnivalók a hivatkozásokról →
help-reference-page = Referenciaoldal →

help-suggestions-header =
    { $location ->
        [inside] Ezen belül: { $element }
       *[top] A legfelső szinten
    }{ $allowed ->
        [none] { " — ide nem kerül semmi." }
        [text] { " — ide szöveget írjon." }
        [text-and-components] { " — ide szöveget írjon, vagy próbálja ezeket:" }
       *[components] { " — amit kipróbálhat:" }
    }

help-suggestions-footer = Nyomja meg a(z) { $shortcut } billentyűt mind a { $total } komponens megtekintéséhez.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] A(z) { $ref } erre hivatkozik: { $target }.
       *[other] A(z) { $ref } erre hivatkozik: { $target } ({ $line }. sor).
    }

help-ref-derived-from =
    { $line ->
        [none] Bevezette: { $owner }, mint { $role }.
       *[other] Bevezette: { $owner } a(z) { $line }. sorban, mint { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] A(z) { $ref } a(z) { $element } { $property } tulajdonságára hivatkozik.
       *[other] A(z) { $ref } a(z) { $element } { $property } tulajdonságára hivatkozik ({ $line }. sor).
    }

help-kind-attribute = attribútum
help-kind-snippet = kódrészlet
help-kind-array-entry = tömbelem

help-default = Alapérték:
help-active-default = Érvényes alapérték:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Megengedett értékek (elemenként egy):
       *[other] Megengedett értékek:
    }

help-suggested-values = Javasolt értékek:

help-inserts = Beszúrja:

help-coordinates =
    { $count ->
        [one] Koordináta:
       *[other] Koordináták:
    }

help-type = Típus:

help-resolved-style = Feloldott stílus (styleNumber { $styleNumber }):

help-resolved-function-names = Feloldott függvénynevek:
help-reset-list = Lista visszaállítása ezen a bemeneten:
help-added-on-input = Hozzáadva ezen a bemeneten:
help-removed-on-input = Eltávolítva ezen a bemeneten:

help-reset-overrides = A(z) { $reset } felülírja ezeket: { $additional } és { $removed }.
