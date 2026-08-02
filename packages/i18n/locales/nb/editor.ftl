# Norwegian Bokmål editor and language-server surfaces. Translated from
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
        [reset] Tilbakestill
       *[update] Oppdater
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } viseren
       *[other] { $word } viseren { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtrer…
editor-variant-next = Velg neste variant
editor-variant-previous = Velg forrige variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Det er funnet et tilgjengelighetsbrudd etter WCAG AA. Klikk for å { $action ->
            [close] lukke
           *[open] åpne
        } tilgjengelighetsrapporten.
        [advisories] Klikk for å { $action ->
            [close] lukke
           *[open] åpne
        } tilgjengelighetsrapporten. Ingen WCAG AA-brudd ble funnet, men det finnes flere anbefalinger om tilgjengelighet.
       *[clean] Klikk for å { $action ->
            [close] lukke
           *[open] åpne
        } tilgjengelighetsrapporten. Ingen tilgjengelighetsproblemer ble funnet.
    }

editor-accessibility-label =
    { $status ->
        [violations] Det er funnet et tilgjengelighetsbrudd etter WCAG AA. Det ble funnet { $count } WCAG AA-brudd. Klikk for å { $action ->
            [close] lukke
           *[open] åpne
        } tilgjengelighetsrapporten.
        [advisories] Ingen WCAG AA-brudd ble funnet. Det ble funnet { $count ->
            [one] { $count } ytterligere anbefaling om tilgjengelighet
           *[other] { $count } ytterligere anbefalinger om tilgjengelighet
        }. Klikk for å { $action ->
            [close] lukke
           *[open] åpne
        } tilgjengelighetsrapporten.
       *[clean] Ingen WCAG AA-brudd ble funnet. Klikk for å { $action ->
            [close] lukke
           *[open] åpne
        } tilgjengelighetsrapporten.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-versjon { $version }

editor-tab-help = Kontekstavhengig hjelp
editor-tab-help-short = Kontekst
editor-tab-errors = Feil
editor-tab-warnings = Advarsler
editor-tab-info = Informasjon
editor-tab-accessibility = Tilgjengelighet
editor-tab-responses = Innsendte svar

editor-tab-with-count = { $label }: { $count }

editor-options = Redigeringsinnstillinger
editor-format-as-doenetml = Formater som DoenetML
editor-format-as-xml = Formater som XML


## The diagnostics panel

editor-diagnostic-line = Linje { $line }

editor-no-errors = Ingen feil
editor-no-warnings = Ingen advarsler
editor-no-info = Ingen informasjonsmeldinger

editor-show-info-annotations = Vis informasjonsmeldinger i redigeringsvinduet
editor-show-accessibility-annotations = Vis tilgjengelighetsmeldinger i redigeringsvinduet

editor-accessibility-learn-more = Slik jobber Doenet med tilgjengelighet

editor-accessibility-violations-heading = Tilgjengelighetsbrudd ({ $standard })

editor-accessibility-other-heading = Andre tilgjengelighetsproblemer
editor-none-found = Ingenting funnet


## Submitted responses

editor-no-responses = Ingen innsendte svar ennå
editor-response-answer-id = Svar-id
editor-response-response = Svar
editor-response-credit = Poeng
editor-response-submitted = Sendt inn


## The context-help panel

help-placeholder = Plasser markøren på et taggnavn, et attributt eller { $ref } for å se dokumentasjonen.

help-unsupported-ref-chain = Hjelp for flerleddede referanser som { $example } støttes ikke ennå.

help-unresolved-ref =
    { $reason ->
        [notFound] Fant ingen referent for referansen: { $ref }.
        [multiple] Fant flere referenter for referansen: { $ref }.
       *[indeterminate] Kunne ikke avgjøre hva { $ref } peker på.
    }

help-learn-about-references = Les om referanser →
help-reference-page = Oppslagsside →

help-suggestions-header =
    { $location ->
        [inside] Inne i { $element }
       *[top] På øverste nivå
    }{ $allowed ->
        [none] { " — her hører ingenting hjemme." }
        [text] { " — her skriver du tekst." }
        [text-and-components] { " — her skriver du tekst, eller prøv:" }
       *[components] { " — ting å prøve:" }
    }

help-suggestions-footer = Trykk på { $shortcut } for å se alle { $total } komponentene.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } er en referanse til { $target }.
       *[other] { $ref } er en referanse til { $target } (linje { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Innført av { $owner } som { $role }.
       *[other] Innført av { $owner } på linje { $line } som { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } er en referanse til egenskapen { $property } på { $element }.
       *[other] { $ref } er en referanse til egenskapen { $property } på { $element } (linje { $line }).
    }

help-kind-attribute = attributt
help-kind-snippet = kodesnutt
help-kind-array-entry = tabellelement

help-default = Standardverdi:
help-active-default = Gjeldende standardverdi:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tillatte verdier (én per element):
       *[other] Tillatte verdier:
    }

help-suggested-values = Foreslåtte verdier:

help-inserts = Setter inn:

help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinater:
    }

help-type = Type:

help-resolved-style = Beregnet stil (styleNumber { $styleNumber }):

help-resolved-function-names = Beregnede funksjonsnavn:
help-reset-list = Tilbakestilling av listen på dette feltet:
help-added-on-input = Lagt til på dette feltet:
help-removed-on-input = Fjernet på dette feltet:

help-reset-overrides = { $reset } overstyrer { $additional } og { $removed }.
