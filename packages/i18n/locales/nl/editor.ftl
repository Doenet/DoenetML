# Dutch editor and language-server surfaces. Translated from
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
        [reset] Herstellen
       *[update] Bijwerken
    }

# Dutch puts the verb last, so the word arrives after the noun it acts on.
editor-update-viewer-title =
    { $shortcut ->
        [none] Weergave { $word }
       *[other] Weergave { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filteren...
editor-variant-next = Volgende variant selecteren
editor-variant-previous = Vorige variant selecteren


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Schending van WCAG AA-toegankelijkheid gevonden. Klik om het toegankelijkheidsrapport te { $action ->
            [close] sluiten
           *[open] openen
        }.
        [advisories] Klik om het toegankelijkheidsrapport te { $action ->
            [close] sluiten
           *[open] openen
        }. Er zijn geen WCAG AA-schendingen gevonden, maar er zijn wel aanvullende aanbevelingen voor toegankelijkheid.
       *[clean] Klik om het toegankelijkheidsrapport te { $action ->
            [close] sluiten
           *[open] openen
        }. Er zijn geen toegankelijkheidsproblemen gevonden.
    }

editor-accessibility-label =
    { $status ->
        [violations] Schending van WCAG AA-toegankelijkheid gevonden. { $count ->
            [one] { $count } WCAG AA-schending
           *[other] { $count } WCAG AA-schendingen
        } gevonden. Klik om het toegankelijkheidsrapport te { $action ->
            [close] sluiten
           *[open] openen
        }.
        [advisories] Geen WCAG AA-schendingen gevonden. { $count ->
            [one] { $count } aanvullende aanbeveling voor toegankelijkheid
           *[other] { $count } aanvullende aanbevelingen voor toegankelijkheid
        } gevonden. Klik om het toegankelijkheidsrapport te { $action ->
            [close] sluiten
           *[open] openen
        }.
       *[clean] Geen WCAG AA-schendingen gevonden. Klik om het toegankelijkheidsrapport te { $action ->
            [close] sluiten
           *[open] openen
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-versie { $version }

editor-tab-help = Contextgevoelige hulp
editor-tab-help-short = Context
editor-tab-errors = Fouten
editor-tab-warnings = Waarschuwingen
editor-tab-info = Info
editor-tab-accessibility = Toegankelijkheid
editor-tab-responses = Ingediende antwoorden

editor-tab-with-count = { $label }: { $count }

editor-options = Editoropties
editor-format-as-doenetml = Opmaken als DoenetML
editor-format-as-xml = Opmaken als XML


## The diagnostics panel

editor-diagnostic-line = Regel { $line }

editor-no-errors = Geen fouten
editor-no-warnings = Geen waarschuwingen
editor-no-info = Geen info-diagnoses

editor-show-info-annotations = Info-diagnoses in de editor tonen
editor-show-accessibility-annotations = Toegankelijkheidsdiagnoses in de editor tonen

editor-accessibility-learn-more = Lees hoe Doenet toegankelijkheid aanpakt

editor-accessibility-violations-heading = Toegankelijkheidsschendingen ({ $standard })

editor-accessibility-other-heading = Andere toegankelijkheidsproblemen
editor-none-found = Niets gevonden


## Submitted responses

editor-no-responses = Nog geen ingediende antwoorden
editor-response-answer-id = Antwoord-id
editor-response-response = Antwoord
editor-response-credit = Punten
editor-response-submitted = Ingediend


## The context-help panel

help-placeholder = Plaats de cursor op een tagnaam, een attribuut of { $ref } voor documentatie.

help-unsupported-ref-chain = Hulp voor meerdelige verwijzingen zoals { $example } is er nog niet.

help-unresolved-ref =
    { $reason ->
        [notFound] Geen doel gevonden voor de verwijzing: { $ref }.
        [multiple] Meerdere doelen gevonden voor de verwijzing: { $ref }.
       *[indeterminate] Een doel voor { $ref } kon niet worden bepaald.
    }

help-learn-about-references = Meer over verwijzingen →
help-reference-page = Referentiepagina →

help-suggestions-header =
    { $location ->
        [inside] Binnen { $element }
       *[top] Op het hoogste niveau
    }{ $allowed ->
        [none] { " — hier hoort niets." }
        [text] { " — typ hier tekst." }
        [text-and-components] { " — typ hier tekst, of probeer:" }
       *[components] { " — om te proberen:" }
    }

help-suggestions-footer = Druk op { $shortcut } om alle { $total } componenten te zien.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } is een verwijzing naar { $target }.
       *[other] { $ref } is een verwijzing naar { $target } (regel { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Geïntroduceerd door { $owner } als { $role }.
       *[other] Geïntroduceerd door { $owner } op regel { $line } als { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } is een verwijzing naar de eigenschap { $property } van { $element }.
       *[other] { $ref } is een verwijzing naar de eigenschap { $property } van { $element } (regel { $line }).
    }

help-kind-attribute = attribuut
help-kind-snippet = fragment
help-kind-array-entry = array-item

help-default = Standaardwaarde:
help-active-default = Actieve standaardwaarde:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Toegestane waarden (één per item):
       *[other] Toegestane waarden:
    }

help-suggested-values = Voorgestelde waarden:

help-inserts = Voegt in:

help-coordinates =
    { $count ->
        [one] Coördinaat:
       *[other] Coördinaten:
    }

help-type = Type:

help-resolved-style = Bepaalde stijl (styleNumber { $styleNumber }):

help-resolved-function-names = Bepaalde functienamen:
help-reset-list = Herstellijst op dit invoerveld:
help-added-on-input = Toegevoegd op dit invoerveld:
help-removed-on-input = Verwijderd op dit invoerveld:

help-reset-overrides = { $reset } gaat vóór { $additional } en { $removed }.
