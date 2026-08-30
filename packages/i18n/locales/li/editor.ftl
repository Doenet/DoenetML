# Limburgish (Limburgs) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Veldeke spelling; see `chrome.ftl` for the note on «tj»,
# «dj» and the vowels «ö», «ü», «ä».
#
# **This file is not `locales/nl` and must not be edited into one.** The two
# are close and were read side by side, which makes their agreement no evidence
# either is right. Where they part company they do so in the commonest words:
# «good» for «goed», «verkierd» for «onjuist», «pöntj» for «punt», «riej» for
# «rij», «blaadzie» for «pagina», «faeler» for «fout», «gevónje» for
# «gevonden» — and in the everyday grammar around them: «neet» for «niet»,
# «waere» for «worden», «zin» for «zijn», «gein» for «geen», «'t» for «het».
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Number.** CLDR has **no** plural rules for `li`:
# `Intl.PluralRules("li")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch here would be selected by some other
# language. None appears anywhere. `one`/`other` is kept because it is the
# split the fallback happens to make correctly for Limburgish too. Every
# symbolic selector — `$action`, `$status`, `$shortcut`, `$reason`,
# `$location`, `$allowed`, `$line`, `$perItem` — is kept byte for byte from
# English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Trökzette
       *[update] Biewerke
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } de kieker
       *[other] { $word } de kieker { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filter…
editor-variant-next = Kees de volgende variant
editor-variant-previous = Kees de veurige variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] D'r is e WCAG AA-euvertraeding van de toegankelikheid gevónje. Klik veur 't rapport euver de toegankelikheid { $action ->
            [close] toe te doon
           *[open] ope te doon
        }.
        [advisories] Klik veur 't rapport euver de toegankelikheid { $action ->
            [close] toe te doon
           *[open] ope te doon
        }. D'r zin gein WCAG AA-euvertraejinge gevónje, mer d'r zin waal extra aanbevaelinge veur de toegankelikheid.
       *[clean] Klik veur 't rapport euver de toegankelikheid { $action ->
            [close] toe te doon
           *[open] ope te doon
        }. D'r zin gein problemer mit de toegankelikheid gevónje.
    }

editor-accessibility-label =
    { $status ->
        [violations] D'r is e WCAG AA-euvertraeding van de toegankelikheid gevónje. { $count ->
            [one] { $count } WCAG AA-euvertraeding gevónje
           *[other] { $count } WCAG AA-euvertraejinge gevónje
        }. Klik veur 't rapport euver de toegankelikheid { $action ->
            [close] toe te doon
           *[open] ope te doon
        }.
        [advisories] Gein WCAG AA-euvertraejinge gevónje. { $count ->
            [one] { $count } extra aanbevaeling veur de toegankelikheid gevónje
           *[other] { $count } extra aanbevaelinge veur de toegankelikheid gevónje
        }. Klik veur 't rapport euver de toegankelikheid { $action ->
            [close] toe te doon
           *[open] ope te doon
        }.
       *[clean] Gein WCAG AA-euvertraejinge gevónje. Klik veur 't rapport euver de toegankelikheid { $action ->
            [close] toe te doon
           *[open] ope te doon
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-versie { $version }

editor-tab-help = Hölp bie 't verbandj
editor-tab-help-short = Verbandj
editor-tab-errors = Faelers
editor-tab-warnings = Waarsjuwinge
editor-tab-info = Informatie
editor-tab-accessibility = Toegankelikheid
editor-tab-responses = Versjikde antwoorde

editor-tab-with-count = { $label }: { $count }

editor-options = Opties van de editor
editor-format-as-doenetml = Opmake es DoenetML
editor-format-as-xml = Opmake es XML


## The diagnostics panel

editor-diagnostic-line = Regel #{ $line }

editor-no-errors = Gein faelers
editor-no-warnings = Gein waarsjuwinge
editor-no-info = Gein informatiemeldinge

editor-show-info-annotations = Wies informatiemeldinge in de editor
editor-show-accessibility-annotations = Wies meldinge euver de toegankelikheid in de editor

editor-accessibility-learn-more = Lier wie Doenet mit de toegankelikheid ómgeit

editor-accessibility-violations-heading = Euvertraejinge van de toegankelikheid ({ $standard })

editor-accessibility-other-heading = Anger problemer mit de toegankelikheid
editor-none-found = Niks gevónje


## Submitted responses

editor-no-responses = Nog gein antwoorde versjik
editor-response-answer-id = Antwoord-id
editor-response-response = Antwoord
editor-response-credit = Pungte
editor-response-submitted = Versjik


## The context-help panel

help-placeholder = Zet de cursor op ene tagnaam, e kenmerk of op { $ref } veur de documentatie.

help-unsupported-ref-chain = Hölp veur verwiezinge mit mie deile, wie { $example }, is d'r nog neet.

help-unresolved-ref =
    { $reason ->
        [notFound] Gein doel gevónje veur de verwiezing: { $ref }.
        [multiple] Mie doele gevónje veur de verwiezing: { $ref }.
       *[indeterminate] E doel veur { $ref } kós neet bepaald waere.
    }

help-learn-about-references = Lier euver verwiezinge →
help-reference-page = Naoslaagblaadzie →

help-suggestions-header =
    { $location ->
        [inside] Binne { $element }
       *[top] Op 't bovenste nivo
    }{ $allowed ->
        [none] { " — hie kump niks." }
        [text] { " — sjrief hie teks." }
        [text-and-components] { " — sjrief hie teks, of probeer:" }
       *[components] { " — dinger veur te probere:" }
    }

help-suggestions-footer = Drök { $shortcut } veur alle { $total } componente te zien.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } is e verwiezing nao { $target }.
       *[other] { $ref } is e verwiezing nao { $target } (regel { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ingebrach door { $owner } es { $role }.
       *[other] Ingebrach door { $owner } op regel { $line } es { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } is e verwiezing nao de eigesjap { $property } van { $element }.
       *[other] { $ref } is e verwiezing nao de eigesjap { $property } van { $element } (regel { $line }).
    }

help-kind-attribute = kenmerk
help-kind-snippet = stökske teks
help-kind-array-entry = ingaank van e array

help-default = Standaard:
help-active-default = Actieve standaard:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Toegestaon waerde (ein per item):
       *[other] Toegestaon waerde:
    }

help-suggested-values = Veurgestelde waerde:

help-inserts = Voog in:

help-coordinates =
    { $count ->
        [one] Coördinaat:
       *[other] Coördinate:
    }

help-type = Zoort:

help-resolved-style = Bepaalde stiel (styleNumber { $styleNumber }):

help-resolved-function-names = Bepaalde functienaam:
help-reset-list = Trökzetlies op dees invoer:
help-added-on-input = Derbie gedaon op dees invoer:
help-removed-on-input = Weggehaold op dees invoer:

help-reset-overrides = { $reset } geit veur { $additional } en { $removed }.
