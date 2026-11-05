# Norwegian Nynorsk editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Nynorsk is a written standard of its own**, not a spelling of Bokmål; see
# `chrome.ftl` for the whole note and for the list of words that must not be
# "corrected" toward `locales/nb`.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them, the way
# `accessibility-heading-level-1` in `chrome.ftl` already does. So do the
# DoenetML identifiers `styleNumber` and the attribute names in
# `help-reset-overrides`.
#
# **Number.** CLDR has plural rules for `nn`, so a `one`/`other` branch here is
# selected by Nynorsk's own rules. Where one is dropped it is because the noun
# does not change — «avvik» and «tilrådingar» are counted below, and only the
# second of the two has a plural ending. Every symbolic selector — `$action`,
# `$status`, `$shortcut`, `$reason`, `$location`, `$allowed`, `$line`,
# `$perItem` — is kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Tilbakestill
       *[update] Oppdater
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } visinga
       *[other] { $word } visinga { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtrer…
editor-variant-next = Vel neste variant
editor-variant-previous = Vel førre variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Brot på WCAG AA-krav til tilgjenge er funne. Klikk for å { $action ->
            [close] lukke
           *[open] opne
        } tilgjengerapporten.
        [advisories] Klikk for å { $action ->
            [close] lukke
           *[open] opne
        } tilgjengerapporten. Ingen brot på WCAG AA vart funne, men det finst fleire tilrådingar om tilgjenge.
       *[clean] Klikk for å { $action ->
            [close] lukke
           *[open] opne
        } tilgjengerapporten. Ingen problem med tilgjenge vart funne.
    }

# «avvik» is neuter and unchanged in the plural, so its count takes no select;
# «tilråding» has one and so keeps its own.
editor-accessibility-label =
    { $status ->
        [violations] Brot på WCAG AA-krav til tilgjenge er funne. { $count } WCAG AA-avvik vart funne. Klikk for å { $action ->
            [close] lukke
           *[open] opne
        } tilgjengerapporten.
        [advisories] Ingen brot på WCAG AA vart funne. { $count ->
            [one] { $count } tilråding om tilgjenge til vart funnen
           *[other] { $count } tilrådingar om tilgjenge til vart funne
        }. Klikk for å { $action ->
            [close] lukke
           *[open] opne
        } tilgjengerapporten.
       *[clean] Ingen brot på WCAG AA vart funne. Klikk for å { $action ->
            [close] lukke
           *[open] opne
        } tilgjengerapporten.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-versjon { $version }

editor-tab-help = Kontekstsensitiv hjelp
editor-tab-help-short = Kontekst
editor-tab-errors = Feil
editor-tab-warnings = Åtvaringar
editor-tab-info = Informasjon
editor-tab-accessibility = Tilgjenge
editor-tab-responses = Innsende svar

editor-tab-with-count = { $label }: { $count }

editor-options = Innstillingar for redigeringa
editor-format-as-doenetml = Formater som DoenetML
editor-format-as-xml = Formater som XML


## The diagnostics panel

editor-diagnostic-line = Linje #{ $line }

editor-no-errors = Ingen feil
editor-no-warnings = Ingen åtvaringar
editor-no-info = Ingen informasjonsmeldingar

editor-show-info-annotations = Vis informasjonsmeldingar i redigeringa
editor-show-accessibility-annotations = Vis meldingar om tilgjenge i redigeringa

editor-accessibility-learn-more = Lær korleis Doenet arbeider med tilgjenge

editor-accessibility-violations-heading = Brot på krav til tilgjenge ({ $standard })

editor-accessibility-other-heading = Andre problem med tilgjenge
editor-none-found = Ingen funne


## Submitted responses

editor-no-responses = Ingen innsende svar enno
editor-response-answer-id = Svar-id
editor-response-response = Svar
editor-response-credit = Poeng
editor-response-submitted = Sendt inn


## The context-help panel

help-placeholder = Set markøren på eit taggnamn, eit attributt eller { $ref } for dokumentasjon.

help-unsupported-ref-chain = Hjelp for fleirdelte referansar som { $example } er ikkje støtta enno.

help-unresolved-ref =
    { $reason ->
        [notFound] Fann ingen referent for referansen: { $ref }.
        [multiple] Fann fleire referentar for referansen: { $ref }.
       *[indeterminate] Ein referent for { $ref } kunne ikkje fastsetjast.
    }

help-learn-about-references = Lær om referansar →
help-reference-page = Referanseside →

help-suggestions-header =
    { $location ->
        [inside] Inne i { $element }
       *[top] På øvste nivå
    }{ $allowed ->
        [none] { " — ingenting kan stå her." }
        [text] { " — skriv tekst her." }
        [text-and-components] { " — skriv tekst her, eller prøv:" }
       *[components] { " — ting å prøve:" }
    }

help-suggestions-footer = Trykk { $shortcut } for å sjå alle { $total } komponentane.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } er ein referanse til { $target }.
       *[other] { $ref } er ein referanse til { $target } (linje { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Innført av { $owner } som { $role }.
       *[other] Innført av { $owner } på linje { $line } som { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } er ein referanse til eigenskapen { $property } på { $element }.
       *[other] { $ref } er ein referanse til eigenskapen { $property } på { $element } (linje { $line }).
    }

help-kind-attribute = attributt
help-kind-snippet = tekstbit
help-kind-array-entry = tabelloppføring

help-default = Standard:
help-active-default = Gjeldande standard:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tillatne verdiar (éin per element):
       *[other] Tillatne verdiar:
    }

help-suggested-values = Framlegg til verdiar:

help-inserts = Set inn:

help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinatar:
    }

help-type = Type:

help-resolved-style = Utrekna stil (styleNumber { $styleNumber }):

help-resolved-function-names = Utrekna funksjonsnamn:
help-reset-list = Nullstillingsliste for dette feltet:
help-added-on-input = Lagt til på dette feltet:
help-removed-on-input = Fjerna frå dette feltet:

help-reset-overrides = { $reset } overstyrer { $additional } og { $removed }.
