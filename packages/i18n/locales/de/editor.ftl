# German editor and language-server surfaces. Translated from
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


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Zurücksetzen
       *[update] Aktualisieren
    }

# German puts the verb last, so the word arrives after the noun it acts on.
editor-update-viewer-title =
    { $shortcut ->
        [none] Ansicht { $word }
       *[other] Ansicht { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtern …
editor-variant-next = Nächste Variante auswählen
editor-variant-previous = Vorherige Variante auswählen


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Verstoß gegen WCAG AA festgestellt. Klicken, um den Bericht zur Barrierefreiheit zu { $action ->
            [close] schließen
           *[open] öffnen
        }.
        [advisories] Klicken, um den Bericht zur Barrierefreiheit zu { $action ->
            [close] schließen
           *[open] öffnen
        }. Es wurden keine WCAG-AA-Verstöße gefunden, es liegen aber weitere Empfehlungen zur Barrierefreiheit vor.
       *[clean] Klicken, um den Bericht zur Barrierefreiheit zu { $action ->
            [close] schließen
           *[open] öffnen
        }. Es wurden keine Probleme mit der Barrierefreiheit gefunden.
    }

editor-accessibility-label =
    { $status ->
        [violations] Verstoß gegen WCAG AA festgestellt. { $count ->
            [one] { $count } WCAG-AA-Verstoß
           *[other] { $count } WCAG-AA-Verstöße
        } gefunden. Klicken, um den Bericht zur Barrierefreiheit zu { $action ->
            [close] schließen
           *[open] öffnen
        }.
        [advisories] Keine WCAG-AA-Verstöße festgestellt. { $count ->
            [one] { $count } weitere Empfehlung zur Barrierefreiheit
           *[other] { $count } weitere Empfehlungen zur Barrierefreiheit
        } gefunden. Klicken, um den Bericht zur Barrierefreiheit zu { $action ->
            [close] schließen
           *[open] öffnen
        }.
       *[clean] Keine WCAG-AA-Verstöße festgestellt. Klicken, um den Bericht zur Barrierefreiheit zu { $action ->
            [close] schließen
           *[open] öffnen
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-Version { $version }

editor-tab-help = Kontextbezogene Hilfe
editor-tab-help-short = Kontext
editor-tab-errors = Fehler
editor-tab-warnings = Warnungen
editor-tab-info = Info
editor-tab-accessibility = Barrierefreiheit
editor-tab-responses = Eingereichte Antworten

editor-tab-with-count = { $label }: { $count }

editor-options = Editor-Optionen
editor-format-as-doenetml = Als DoenetML formatieren
editor-format-as-xml = Als XML formatieren


## The diagnostics panel

editor-diagnostic-line = Zeile { $line }

editor-no-errors = Keine Fehler
editor-no-warnings = Keine Warnungen
editor-no-info = Keine Info-Diagnosen

editor-show-info-annotations = Info-Diagnosen im Editor anzeigen
editor-show-accessibility-annotations = Diagnosen zur Barrierefreiheit im Editor anzeigen

editor-accessibility-learn-more = Wie Doenet Barrierefreiheit angeht

editor-accessibility-violations-heading = Verstöße gegen die Barrierefreiheit ({ $standard })

editor-accessibility-other-heading = Weitere Probleme mit der Barrierefreiheit
editor-none-found = Nichts gefunden


## Submitted responses

editor-no-responses = Noch keine eingereichten Antworten
editor-response-answer-id = Antwort-Id
editor-response-response = Antwort
editor-response-credit = Anrechnung
editor-response-submitted = Eingereicht


## The context-help panel

help-placeholder = Den Cursor auf einen Tag-Namen, ein Attribut oder { $ref } setzen, um die Dokumentation zu sehen.

help-unsupported-ref-chain = Hilfe zu mehrteiligen Referenzen wie { $example } gibt es noch nicht.

help-unresolved-ref =
    { $reason ->
        [notFound] Kein Bezug für die Referenz gefunden: { $ref }.
        [multiple] Mehrere Bezüge für die Referenz gefunden: { $ref }.
       *[indeterminate] Ein Bezug für { $ref } ließ sich nicht bestimmen.
    }

help-learn-about-references = Mehr über Referenzen erfahren →
help-reference-page = Referenzseite →

help-suggestions-header =
    { $location ->
        [inside] Innerhalb von { $element }
       *[top] Auf oberster Ebene
    }{ $allowed ->
        [none] { " — hier gehört nichts hin." }
        [text] { " — hier Text eingeben." }
        [text-and-components] { " — hier Text eingeben oder Folgendes ausprobieren:" }
       *[components] { " — zum Ausprobieren:" }
    }

help-suggestions-footer = { $shortcut } drücken, um alle { $total } Komponenten zu sehen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ist eine Referenz auf { $target }.
       *[other] { $ref } ist eine Referenz auf { $target } (Zeile { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Eingeführt von { $owner } als { $role }.
       *[other] Eingeführt von { $owner } in Zeile { $line } als { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ist eine Referenz auf die Eigenschaft { $property } von { $element }.
       *[other] { $ref } ist eine Referenz auf die Eigenschaft { $property } von { $element } (Zeile { $line }).
    }

help-kind-attribute = Attribut
help-kind-snippet = Textbaustein
help-kind-array-entry = Array-Eintrag

help-default = Standardwert:
help-active-default = Aktiver Standardwert:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Zulässige Werte (einer pro Element):
       *[other] Zulässige Werte:
    }

help-suggested-values = Vorgeschlagene Werte:

help-inserts = Fügt ein:

help-coordinates =
    { $count ->
        [one] Koordinate:
       *[other] Koordinaten:
    }

help-type = Typ:

help-resolved-style = Aufgelöster Stil (styleNumber { $styleNumber }):

help-resolved-function-names = Aufgelöste Funktionsnamen:
help-reset-list = Zurücksetzliste an dieser Eingabe:
help-added-on-input = An dieser Eingabe hinzugefügt:
help-removed-on-input = An dieser Eingabe entfernt:

help-reset-overrides = { $reset } hat Vorrang vor { $additional } und { $removed }.
