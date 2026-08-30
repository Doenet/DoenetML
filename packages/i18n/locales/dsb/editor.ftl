# Lower Sorbian (dolnoserbšćina) editor and language-server surfaces: the
# footer, the diagnostics panel, the variant picker, the accessibility button
# and the context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **`locales/hsb` was open beside this file while it was written**, and the
# warning `diagnostics.ftl` carries applies here in full: the two Sorbian
# catalogs are expected to look alike, and their agreement is not evidence
# either is right.
#
# **The dual is selected by Lower Sorbian's own CLDR rules**; `chrome.ftl`
# carries the whole note. Where a count appears here it takes all four
# categories.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# Every symbolic selector — `$action`, `$status`, `$shortcut`, `$reason`,
# `$location`, `$allowed`, `$line`, `$perItem` — is kept byte for byte from
# English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Slědk
       *[update] Aktualizěruj
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } wobglědowak
       *[other] { $word } wobglědowak { $shortcut }
    }


## The variant picker

editor-variant = Warianta
editor-variant-filter = Filtruj…
editor-variant-next = Wubjeŕ pśiducu wariantu
editor-variant-previous = Wubjeŕ pjerwjejšnu wariantu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Pśestupjenje pśeśiwo WCAG AA za bźezbariernosć jo namakane. Klikń, aby rozprawu wo bźezbariernosći { $action ->
            [close] zacynił
           *[open] wócyńěł
        }.
        [advisories] Klikń, aby rozprawu wo bźezbariernosći { $action ->
            [close] zacynił
           *[open] wócyńěł
        }. Žedne pśestupjenja pśeśiwo WCAG AA njejsu se namakali, ale su dalše naraźenjy k bźezbariernosći.
       *[clean] Klikń, aby rozprawu wo bźezbariernosći { $action ->
            [close] zacynił
           *[open] wócyńěł
        }. Žedne problemy z bźezbariernosću njejsu se namakali.
    }

# Both counts take the full four categories, the dual included: «pśestupjenje» is
# neuter and «naraźenj» masculine inanimate.
editor-accessibility-label =
    { $status ->
        [violations] Pśestupjenje pśeśiwo WCAG AA za bźezbariernosć jo namakane. { $count ->
            [one] { $count } pśestupjenje pśeśiwo WCAG AA
            [two] { $count } pśestupjeni pśeśiwo WCAG AA
            [few] { $count } pśestupjenja pśeśiwo WCAG AA
           *[other] { $count } pśestupjenjow pśeśiwo WCAG AA
        } jo namakane. Klikń, aby rozprawu wo bźezbariernosći { $action ->
            [close] zacynił
           *[open] wócyńěł
        }.
        [advisories] Žedne pśestupjenja pśeśiwo WCAG AA njejsu namakane. { $count ->
            [one] { $count } dalši naraźenj k bźezbariernosći
            [two] { $count } dalšej naraźenjaj k bźezbariernosći
            [few] { $count } dalše naraźenjy k bźezbariernosći
           *[other] { $count } dalšich naraźenjow k bźezbariernosći
        } jo namakany. Klikń, aby rozprawu wo bźezbariernosći { $action ->
            [close] zacynił
           *[open] wócyńěł
        }.
       *[clean] Žedne pśestupjenja pśeśiwo WCAG AA njejsu namakane. Klikń, aby rozprawu wo bźezbariernosći { $action ->
            [close] zacynił
           *[open] wócyńěł
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Wersija DoenetML { $version }

editor-tab-help = Pomoc k aktualnemu městnu
editor-tab-help-short = Kontekst
editor-tab-errors = Zmylki
editor-tab-warnings = Warnowanja
editor-tab-info = Informacije
editor-tab-accessibility = Bźezbariernosć
editor-tab-responses = Pósłane wótegrony

editor-tab-with-count = { $label }: { $count }

editor-options = Nastajenja editora
editor-format-as-doenetml = Formatuj jako DoenetML
editor-format-as-xml = Formatuj jako XML


## The diagnostics panel

editor-diagnostic-line = Smužka #{ $line }

editor-no-errors = Žedne zmylki
editor-no-warnings = Žedne warnowanja
editor-no-info = Žedne informaciske zdźělenki

editor-show-info-annotations = Pokaž informaciske zdźělenki w editorje
editor-show-accessibility-annotations = Pokaž zdźělenki k bźezbariernosći w editorje

editor-accessibility-learn-more = Zgóń, kak Doenet z bźezbariernosću wobchadźa

editor-accessibility-violations-heading = Pśestupjenja pśeśiwo bźezbariernosći ({ $standard })

editor-accessibility-other-heading = Druhe problemy z bźezbariernosću
editor-none-found = Nic namakane


## Submitted responses

editor-no-responses = Hišće žedne pósłane wótegrony
editor-response-answer-id = Id wótegrony
editor-response-response = Wótegrona
editor-response-credit = Dypki
editor-response-submitted = Pósłane


## The context-help panel

help-placeholder = Stajam kursor na mě taga, atribut abo { $ref }, aby dokumentaciju wiźeł.

help-unsupported-ref-chain = Pomoc za wěcejdźělne referency kaž { $example } hyšći njejo podpěrana.

help-unresolved-ref =
    { $reason ->
        [notFound] Za referencu { $ref } njejo se žeden referent namakał.
        [multiple] Za referencu { $ref } jo se wjacore referenty namakało.
       *[indeterminate] Referent za { $ref } njeda se postajić.
    }

help-learn-about-references = Zgóń wěcej wo referencach →
help-reference-page = Referencna bok →

help-suggestions-header =
    { $location ->
        [inside] W { $element }
       *[top] Na najwyšim schodźenku
    }{ $allowed ->
        [none] { " — tu nic njesteji." }
        [text] { " — pisaj tu tekst." }
        [text-and-components] { " — pisaj tu tekst, abo spytaj:" }
       *[components] { " — spytaj:" }
    }

help-suggestions-footer = Tłoc { $shortcut }, aby wše { $total } komponenty wiźeł.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } jo referenca na { $target }.
       *[other] { $ref } jo referenca na { $target } (smužka { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Zawjedźene wót { $owner } jako { $role }.
       *[other] Zawjedźene wót { $owner } na smužce { $line } jako { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } jo referenca na kakosć { $property } wót { $element }.
       *[other] { $ref } jo referenca na kakosć { $property } wót { $element } (smužka { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = tekstowy fragment
help-kind-array-entry = zapisk pola

help-default = Standard:
help-active-default = Aktiwny standard:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Dowolene gódnoty (jedna na zapisk):
       *[other] Dowolene gódnoty:
    }

help-suggested-values = Naraźenjowane gódnoty:

help-inserts = Zasadźa:

help-coordinates =
    { $count ->
        [one] Koordinata:
        [two] Koordinaće:
        [few] Koordinaty:
       *[other] Koordinatow:
    }

help-type = Typ:

help-resolved-style = Wobličeny stil (styleNumber { $styleNumber }):

help-resolved-function-names = Wobličene mjena funkcijow:
help-reset-list = Lisćina Slědkostajenja za tutón zapisk:
help-added-on-input = Pśidate pśi tutym zapisku:
help-removed-on-input = Wotstronjene pśi tutym zapisku:

help-reset-overrides = { $reset } pśepisujo { $additional } a { $removed }.
