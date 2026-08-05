# Low German editor and language-server surfaces. Translated from
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
        [reset] Torüchsetten
       *[update] Opfrischen
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Kieker { $word }
       *[other] Kieker { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filter…
editor-variant-next = Nächste Variant utsöken
editor-variant-previous = Vörige Variant utsöken


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] En Verstoot gegen de Togänglichkeit na WCAG AA is faststellt worrn. Klick, üm den Bericht över de Togänglichkeit { $action ->
            [close] totomaken
           *[open] optomaken
        }.
        [advisories] Klick, üm den Bericht över de Togänglichkeit { $action ->
            [close] totomaken
           *[open] optomaken
        }. Dat sünd keen Verstöte na WCAG AA funnen worrn, aver dat gifft noch Anraden to de Togänglichkeit.
       *[clean] Klick, üm den Bericht över de Togänglichkeit { $action ->
            [close] totomaken
           *[open] optomaken
        }. Dat sünd keen Problemen mit de Togänglichkeit funnen worrn.
    }

editor-accessibility-label =
    { $status ->
        [violations] En Verstoot gegen de Togänglichkeit na WCAG AA is faststellt worrn. { $count ->
            [one] Dat is { $count } Verstoot na WCAG AA
           *[other] Dat sünd { $count } Verstöte na WCAG AA
        } funnen worrn. Klick, üm den Bericht över de Togänglichkeit { $action ->
            [close] totomaken
           *[open] optomaken
        }.
        [advisories] Dat sünd keen Verstöte na WCAG AA faststellt worrn. { $count ->
            [one] Dat is { $count } wieder Anraad to de Togänglichkeit
           *[other] Dat sünd { $count } wiedere Anraden to de Togänglichkeit
        } funnen worrn. Klick, üm den Bericht över de Togänglichkeit { $action ->
            [close] totomaken
           *[open] optomaken
        }.
       *[clean] Dat sünd keen Verstöte na WCAG AA faststellt worrn. Klick, üm den Bericht över de Togänglichkeit { $action ->
            [close] totomaken
           *[open] optomaken
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-Verschoon { $version }

editor-tab-help = Kontextafhangige Hülp
editor-tab-help-short = Kontext
editor-tab-errors = Fehlers
editor-tab-warnings = Wohrschauen
editor-tab-info = Info
editor-tab-accessibility = Togänglichkeit
editor-tab-responses = Afschickte Antwoorden

editor-tab-with-count = { $label }: { $count }

editor-options = Instellen vun’n Editor
editor-format-as-doenetml = As DoenetML formateren
editor-format-as-xml = As XML formateren


## The diagnostics panel

editor-diagnostic-line = Reeg Nr. { $line }

editor-no-errors = Keen Fehlers
editor-no-warnings = Keen Wohrschauen
editor-no-info = Keen Info-Mellen

editor-show-info-annotations = Info-Mellen in’n Editor wiesen
editor-show-accessibility-annotations = Mellen to de Togänglichkeit in’n Editor wiesen

editor-accessibility-learn-more = Wodennig Doenet mit Togänglichkeit ümgeiht

editor-accessibility-violations-heading = Verstöte gegen de Togänglichkeit ({ $standard })

editor-accessibility-other-heading = Anner Problemen mit de Togänglichkeit
editor-none-found = Nix funnen


## Submitted responses

editor-no-responses = Noch keen Antwoorden afschickt
editor-response-answer-id = Id vun de Antwoort
editor-response-response = Antwoort
editor-response-credit = Pünkte
editor-response-submitted = Afschickt


## The context-help panel

help-placeholder = Sett den Wieser op en Tag-Naam, en Attribut oder { $ref }, üm de Dokumentatschoon to sehn.

help-unsupported-ref-chain = Hülp för mehrdeelige Verwiesen as { $example } gifft dat noch nich.

help-unresolved-ref =
    { $reason ->
        [notFound] Keen Objekt för de Verwiesen funnen: { $ref }.
        [multiple] Mehr as een Objekt för de Verwiesen funnen: { $ref }.
       *[indeterminate] En Objekt för { $ref } kunn nich fastleggt warrn.
    }

help-learn-about-references = Mehr över Verwiesen weten →
help-reference-page = Naslaanpagina →

help-suggestions-header =
    { $location ->
        [inside] Binnen { $element }
       *[top] Op de böverste Evene
    }{ $allowed ->
        [none] { " — hier höört nix hen." }
        [text] { " — tipp hier Text in." }
        [text-and-components] { " — tipp hier Text in, oder versöök:" }
       *[components] { " — versöök:" }
    }

help-suggestions-footer = Drück { $shortcut }, üm all { $total } Komponenten to sehn.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } is en Verwiesen op { $target }.
       *[other] { $ref } is en Verwiesen op { $target } (Reeg { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Inföhrt vun { $owner } as { $role }.
       *[other] Inföhrt vun { $owner } in Reeg { $line } as { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } is en Verwiesen op de Egenschop { $property } vun { $element }.
       *[other] { $ref } is en Verwiesen op de Egenschop { $property } vun { $element } (Reeg { $line }).
    }

help-kind-attribute = Attribut
help-kind-snippet = Textbaustein
help-kind-array-entry = Element vun en Reeg

help-default = Standard:
help-active-default = Aktiv Standard:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Verlöövte Weerten (een je Element):
       *[other] Verlöövte Weerten:
    }

help-suggested-values = Vörslagen Weerten:

help-inserts = Föögt in:

help-coordinates =
    { $count ->
        [one] Koordinaat:
       *[other] Koordinaten:
    }

help-type = Typ:

help-resolved-style = Oplööst Stil (styleNumber { $styleNumber }):

help-resolved-function-names = Oplööste Funkschoonnamen:
help-reset-list = List för dat Torüchsetten op dit Feld:
help-added-on-input = Op dit Feld toföögt:
help-removed-on-input = Op dit Feld wegnahmen:

help-reset-overrides = { $reset } geiht vör { $additional } un { $removed }.
