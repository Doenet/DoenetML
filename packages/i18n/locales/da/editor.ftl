# Danish editor and language-server surfaces. Translated from
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
        [reset] Nulstil
       *[update] Opdater
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } fremviseren
       *[other] { $word } fremviseren { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtrér…
editor-variant-next = Vælg næste variant
editor-variant-previous = Vælg forrige variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Der er fundet et tilgængelighedsbrud efter WCAG AA. Klik for at { $action ->
            [close] lukke
           *[open] åbne
        } tilgængelighedsrapporten.
        [advisories] Klik for at { $action ->
            [close] lukke
           *[open] åbne
        } tilgængelighedsrapporten. Der blev ikke fundet WCAG AA-brud, men der er yderligere anbefalinger om tilgængelighed.
       *[clean] Klik for at { $action ->
            [close] lukke
           *[open] åbne
        } tilgængelighedsrapporten. Der blev ikke fundet tilgængelighedsproblemer.
    }

editor-accessibility-label =
    { $status ->
        [violations] Der er fundet et tilgængelighedsbrud efter WCAG AA. Der blev fundet { $count } WCAG AA-brud. Klik for at { $action ->
            [close] lukke
           *[open] åbne
        } tilgængelighedsrapporten.
        [advisories] Der blev ikke fundet WCAG AA-brud. Der blev fundet { $count ->
            [one] { $count } yderligere anbefaling om tilgængelighed
           *[other] { $count } yderligere anbefalinger om tilgængelighed
        }. Klik for at { $action ->
            [close] lukke
           *[open] åbne
        } tilgængelighedsrapporten.
       *[clean] Der blev ikke fundet WCAG AA-brud. Klik for at { $action ->
            [close] lukke
           *[open] åbne
        } tilgængelighedsrapporten.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-version { $version }

editor-tab-help = Kontekstafhængig hjælp
editor-tab-help-short = Kontekst
editor-tab-errors = Fejl
editor-tab-warnings = Advarsler
editor-tab-info = Information
editor-tab-accessibility = Tilgængelighed
editor-tab-responses = Indsendte svar

editor-tab-with-count = { $label }: { $count }

editor-options = Editorindstillinger
editor-format-as-doenetml = Formatér som DoenetML
editor-format-as-xml = Formatér som XML


## The diagnostics panel

editor-diagnostic-line = Linje { $line }

editor-no-errors = Ingen fejl
editor-no-warnings = Ingen advarsler
editor-no-info = Ingen informationsmeddelelser

editor-show-info-annotations = Vis informationsmeddelelser i editoren
editor-show-accessibility-annotations = Vis tilgængelighedsmeddelelser i editoren

editor-accessibility-learn-more = Sådan arbejder Doenet med tilgængelighed

editor-accessibility-violations-heading = Tilgængelighedsbrud ({ $standard })

editor-accessibility-other-heading = Andre tilgængelighedsproblemer
editor-none-found = Intet fundet


## Submitted responses

editor-no-responses = Ingen indsendte svar endnu
editor-response-answer-id = Svar-id
editor-response-response = Svar
editor-response-credit = Point
editor-response-submitted = Indsendt


## The context-help panel

help-placeholder = Placér markøren på et tagnavn, en attribut eller { $ref } for at se dokumentationen.

help-unsupported-ref-chain = Hjælp til flerleddede referencer som { $example } understøttes endnu ikke.

help-unresolved-ref =
    { $reason ->
        [notFound] Der blev ikke fundet nogen referent for referencen: { $ref }.
        [multiple] Der blev fundet flere referenter for referencen: { $ref }.
       *[indeterminate] Det kunne ikke afgøres, hvad { $ref } peger på.
    }

help-learn-about-references = Læs om referencer →
help-reference-page = Opslagsside →

help-suggestions-header =
    { $location ->
        [inside] Inde i { $element }
       *[top] På øverste niveau
    }{ $allowed ->
        [none] { " — her hører intet hjemme." }
        [text] { " — her skriver du tekst." }
        [text-and-components] { " — her skriver du tekst, eller prøv:" }
       *[components] { " — ting at prøve:" }
    }

help-suggestions-footer = Tryk på { $shortcut } for at se alle { $total } komponenter.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } er en reference til { $target }.
       *[other] { $ref } er en reference til { $target } (linje { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Indført af { $owner } som { $role }.
       *[other] Indført af { $owner } på linje { $line } som { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } er en reference til egenskaben { $property } på { $element }.
       *[other] { $ref } er en reference til egenskaben { $property } på { $element } (linje { $line }).
    }

help-kind-attribute = attribut
help-kind-snippet = kodestump
help-kind-array-entry = arrayelement

help-default = Standardværdi:
help-active-default = Gældende standardværdi:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tilladte værdier (én pr. element):
       *[other] Tilladte værdier:
    }

help-suggested-values = Foreslåede værdier:

help-inserts = Indsætter:

help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinater:
    }

help-type = Type:

help-resolved-style = Beregnet stil (styleNumber { $styleNumber }):

help-resolved-function-names = Beregnede funktionsnavne:
help-reset-list = Nulstilling af listen på dette felt:
help-added-on-input = Tilføjet på dette felt:
help-removed-on-input = Fjernet på dette felt:

help-reset-overrides = { $reset } tilsidesætter { $additional } og { $removed }.
