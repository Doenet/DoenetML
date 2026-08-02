# Swedish editor and language-server surfaces. Translated from
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
        [reset] Återställ
       *[update] Uppdatera
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } visaren
       *[other] { $word } visaren { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtrera…
editor-variant-next = Välj nästa variant
editor-variant-previous = Välj föregående variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] En tillgänglighetsbrist enligt WCAG AA har hittats. Klicka för att { $action ->
            [close] stänga
           *[open] öppna
        } tillgänglighetsrapporten.
        [advisories] Klicka för att { $action ->
            [close] stänga
           *[open] öppna
        } tillgänglighetsrapporten. Inga WCAG AA-brister hittades, men det finns ytterligare tillgänglighetsrekommendationer.
       *[clean] Klicka för att { $action ->
            [close] stänga
           *[open] öppna
        } tillgänglighetsrapporten. Inga tillgänglighetsproblem hittades.
    }

editor-accessibility-label =
    { $status ->
        [violations] En tillgänglighetsbrist enligt WCAG AA har hittats. { $count ->
            [one] { $count } WCAG AA-brist
           *[other] { $count } WCAG AA-brister
        } hittades. Klicka för att { $action ->
            [close] stänga
           *[open] öppna
        } tillgänglighetsrapporten.
        [advisories] Inga WCAG AA-brister hittades. { $count ->
            [one] { $count } ytterligare tillgänglighetsrekommendation
           *[other] { $count } ytterligare tillgänglighetsrekommendationer
        } hittades. Klicka för att { $action ->
            [close] stänga
           *[open] öppna
        } tillgänglighetsrapporten.
       *[clean] Inga WCAG AA-brister hittades. Klicka för att { $action ->
            [close] stänga
           *[open] öppna
        } tillgänglighetsrapporten.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-version { $version }

editor-tab-help = Sammanhangsberoende hjälp
editor-tab-help-short = Sammanhang
editor-tab-errors = Fel
editor-tab-warnings = Varningar
editor-tab-info = Information
editor-tab-accessibility = Tillgänglighet
editor-tab-responses = Inskickade svar

editor-tab-with-count = { $label }: { $count }

editor-options = Redigerarinställningar
editor-format-as-doenetml = Formatera som DoenetML
editor-format-as-xml = Formatera som XML


## The diagnostics panel

editor-diagnostic-line = Rad { $line }

editor-no-errors = Inga fel
editor-no-warnings = Inga varningar
editor-no-info = Inga informationsmeddelanden

editor-show-info-annotations = Visa informationsmeddelanden i redigeraren
editor-show-accessibility-annotations = Visa tillgänglighetsmeddelanden i redigeraren

editor-accessibility-learn-more = Så arbetar Doenet med tillgänglighet

editor-accessibility-violations-heading = Tillgänglighetsbrister ({ $standard })

editor-accessibility-other-heading = Andra tillgänglighetsproblem
editor-none-found = Inget hittades


## Submitted responses

editor-no-responses = Inga inskickade svar ännu
editor-response-answer-id = Svars-id
editor-response-response = Svar
editor-response-credit = Poäng
editor-response-submitted = Inskickat


## The context-help panel

help-placeholder = Placera markören på ett taggnamn, ett attribut eller { $ref } för dokumentation.

help-unsupported-ref-chain = Hjälp för flerledade referenser som { $example } stöds inte ännu.

help-unresolved-ref =
    { $reason ->
        [notFound] Ingen referent hittades för referensen: { $ref }.
        [multiple] Flera referenter hittades för referensen: { $ref }.
       *[indeterminate] Det gick inte att avgöra vad { $ref } syftar på.
    }

help-learn-about-references = Läs om referenser →
help-reference-page = Referenssida →

help-suggestions-header =
    { $location ->
        [inside] Inuti { $element }
       *[top] På översta nivån
    }{ $allowed ->
        [none] { " — här hör ingenting hemma." }
        [text] { " — här skriver du text." }
        [text-and-components] { " — här skriver du text, eller prova:" }
       *[components] { " — saker att prova:" }
    }

help-suggestions-footer = Tryck på { $shortcut } för att se alla { $total } komponenter.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } är en referens till { $target }.
       *[other] { $ref } är en referens till { $target } (rad { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Införd av { $owner } som { $role }.
       *[other] Införd av { $owner } på rad { $line } som { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } är en referens till egenskapen { $property } hos { $element }.
       *[other] { $ref } är en referens till egenskapen { $property } hos { $element } (rad { $line }).
    }

help-kind-attribute = attribut
help-kind-snippet = kodsnutt
help-kind-array-entry = fältelement

help-default = Standardvärde:
help-active-default = Gällande standardvärde:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tillåtna värden (ett per element):
       *[other] Tillåtna värden:
    }

help-suggested-values = Föreslagna värden:

help-inserts = Infogar:

help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinater:
    }

help-type = Typ:

help-resolved-style = Beräknad stil (styleNumber { $styleNumber }):

help-resolved-function-names = Beräknade funktionsnamn:
help-reset-list = Återställning av listan på detta fält:
help-added-on-input = Tillagt på detta fält:
help-removed-on-input = Borttaget på detta fält:

help-reset-overrides = { $reset } åsidosätter { $additional } och { $removed }.
