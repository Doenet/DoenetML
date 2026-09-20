# Upper Sorbian (hornjoserbšćina) editor and language-server surfaces: the
# footer, the diagnostics panel, the variant picker, the accessibility button
# and the context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **The dual is selected by Sorbian's own CLDR rules**; `chrome.ftl` carries
# the whole note. Where a count appears here it takes all four categories.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them, the way
# `accessibility-heading-level-1` in `chrome.ftl` already does. So do the
# DoenetML identifiers `styleNumber` and the attribute names in
# `help-reset-overrides`.
#
# Every symbolic selector — `$action`, `$status`, `$shortcut`, `$reason`,
# `$location`, `$allowed`, `$line`, `$perItem` — is kept byte for byte from
# English: a translated variant key is a branch nothing can reach.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Wróć
       *[update] Aktualizuj
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } wobhladowak
       *[other] { $word } wobhladowak { $shortcut }
    }


## The variant picker

editor-variant = Warianta
editor-variant-filter = Filtruj…
editor-variant-next = Wubjer přichodnu wariantu
editor-variant-previous = Wubjer předchadnu wariantu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Přeńdźenje přećiwo WCAG AA za bjezbarjernosć je namakane. Klikń, zo by rozprawu wo bjezbarjernosći { $action ->
            [close] začinił
           *[open] wotewrěł
        }.
        [advisories] Klikń, zo by rozprawu wo bjezbarjernosći { $action ->
            [close] začinił
           *[open] wotewrěł
        }. Žane přeńdźenja přećiwo WCAG AA njejsu so namakali, ale su dalše namjety k bjezbarjernosći.
       *[clean] Klikń, zo by rozprawu wo bjezbarjernosći { $action ->
            [close] začinił
           *[open] wotewrěł
        }. Žane problemy z bjezbarjernosću njejsu so namakali.
    }

# Both counts take the full four categories, the dual included: «přeńdźenje» is
# neuter and «namjet» masculine inanimate.
editor-accessibility-label =
    { $status ->
        [violations] Přeńdźenje přećiwo WCAG AA za bjezbarjernosć je namakane. { $count ->
            [one] { $count } přeńdźenje přećiwo WCAG AA
            [two] { $count } přeńdźeni přećiwo WCAG AA
            [few] { $count } přeńdźenja přećiwo WCAG AA
           *[other] { $count } přeńdźenjow přećiwo WCAG AA
        } je namakane. Klikń, zo by rozprawu wo bjezbarjernosći { $action ->
            [close] začinił
           *[open] wotewrěł
        }.
        [advisories] Žane přeńdźenja přećiwo WCAG AA njejsu namakane. { $count ->
            [one] { $count } dalši namjet k bjezbarjernosći
            [two] { $count } dalšej namjetaj k bjezbarjernosći
            [few] { $count } dalše namjety k bjezbarjernosći
           *[other] { $count } dalšich namjetow k bjezbarjernosći
        } je namakany. Klikń, zo by rozprawu wo bjezbarjernosći { $action ->
            [close] začinił
           *[open] wotewrěł
        }.
       *[clean] Žane přeńdźenja přećiwo WCAG AA njejsu namakane. Klikń, zo by rozprawu wo bjezbarjernosći { $action ->
            [close] začinił
           *[open] wotewrěł
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
editor-tab-accessibility = Bjezbarjernosć
editor-tab-responses = Pósłane wotmołwy

editor-tab-with-count = { $label }: { $count }

editor-options = Nastajenja editora
editor-format-as-doenetml = Formatuj jako DoenetML
editor-format-as-xml = Formatuj jako XML


## The diagnostics panel

editor-diagnostic-line = Linka #{ $line }

editor-no-errors = Žane zmylki
editor-no-warnings = Žane warnowanja
editor-no-info = Žane informaciske zdźělenki

editor-show-info-annotations = Pokaž informaciske zdźělenki w editorje
editor-show-accessibility-annotations = Pokaž zdźělenki k bjezbarjernosći w editorje

editor-accessibility-learn-more = Zhoń, kak Doenet z bjezbarjernosću wobchadźa

editor-accessibility-violations-heading = Přeńdźenja přećiwo bjezbarjernosći ({ $standard })

editor-accessibility-other-heading = Druhe problemy z bjezbarjernosću
editor-none-found = Ničo namakane


## Submitted responses

editor-no-responses = Hišće žane pósłane wotmołwy
editor-response-answer-id = Id wotmołwy
editor-response-response = Wotmołwa
editor-response-credit = Dypki
editor-response-submitted = Pósłane


## The context-help panel

help-placeholder = Stajam kursor na mjeno taga, atribut abo { $ref }, zo by dokumentaciju widźał.

help-unsupported-ref-chain = Pomoc za wjacedźělne referency kaž { $example } hišće njeje podpěrana.

help-unresolved-ref =
    { $reason ->
        [notFound] Za referencu { $ref } njeje so žadyn referent namakał.
        [multiple] Za referencu { $ref } je so wjacore referenty namakało.
       *[indeterminate] Referent za { $ref } njeda so postajić.
    }

help-learn-about-references = Zhoń wjace wo referencach →
help-reference-page = Referencna strona →

help-suggestions-header =
    { $location ->
        [inside] W { $element }
       *[top] Na najwyšim schodźenku
    }{ $allowed ->
        [none] { " — tu ničo njesteji." }
        [text] { " — pisaj tu tekst." }
        [text-and-components] { " — pisaj tu tekst, abo spytaj:" }
       *[components] { " — spytaj:" }
    }

help-suggestions-footer = Tłóč { $shortcut }, zo by wšě { $total } komponenty widźał.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } je referenca na { $target }.
       *[other] { $ref } je referenca na { $target } (linka { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Zawjedźene wot { $owner } jako { $role }.
       *[other] Zawjedźene wot { $owner } na lince { $line } jako { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } je referenca na kajkosć { $property } wot { $element }.
       *[other] { $ref } je referenca na kajkosć { $property } wot { $element } (linka { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = tekstowy fragment
help-kind-array-entry = zapisk pola

help-default = Standard:
help-active-default = Aktiwny standard:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Dowolene hódnoty (jedna na zapisk):
       *[other] Dowolene hódnoty:
    }

help-suggested-values = Namjetowane hódnoty:

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
help-reset-list = Lisćina wróćostajenja za tutón zapisk:
help-added-on-input = Přidate při tutym zapisku:
help-removed-on-input = Wotstronjene při tutym zapisku:

help-reset-overrides = { $reset } přepisuje { $additional } a { $removed }.
