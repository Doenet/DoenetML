# Friulian (furlan) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The official spelling; see `chrome.ftl`.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Number.** CLDR has plural rules for `fur`, so a `one`/`other` branch is
# selected by Friulian's own rules and is written wherever the noun changes.
# Every symbolic selector — `$action`, `$status`, `$shortcut`, `$reason`,
# `$location`, `$allowed`, `$line`, `$perItem` — is kept byte for byte from
# English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ripristine
       *[update] Inzorne
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } il visualizadôr
       *[other] { $word } il visualizadôr { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtre…
editor-variant-next = Sielç la variante prossime
editor-variant-previous = Sielç la variante precedente


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Si à cjatât une violazion di acessibilitât WCAG AA. Frache par { $action ->
            [close] sierâ
           *[open] vierzi
        } il rapuart di acessibilitât.
        [advisories] Frache par { $action ->
            [close] sierâ
           *[open] vierzi
        } il rapuart di acessibilitât. No si à cjatât violazions WCAG AA, ma a son altris conseis di acessibilitât.
       *[clean] Frache par { $action ->
            [close] sierâ
           *[open] vierzi
        } il rapuart di acessibilitât. No si à cjatât nissun probleme di acessibilitât.
    }

editor-accessibility-label =
    { $status ->
        [violations] Si à cjatât une violazion di acessibilitât WCAG AA. Si à cjatât { $count ->
            [one] { $count } violazion WCAG AA
           *[other] { $count } violazions WCAG AA
        }. Frache par { $action ->
            [close] sierâ
           *[open] vierzi
        } il rapuart di acessibilitât.
        [advisories] No si à cjatât violazions WCAG AA. Si à cjatât { $count ->
            [one] { $count } consei di acessibilitât in plui
           *[other] { $count } conseis di acessibilitât in plui
        }. Frache par { $action ->
            [close] sierâ
           *[open] vierzi
        } il rapuart di acessibilitât.
       *[clean] No si à cjatât violazions WCAG AA. Frache par { $action ->
            [close] sierâ
           *[open] vierzi
        } il rapuart di acessibilitât.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Version di DoenetML { $version }

editor-tab-help = Jutori pal contest
editor-tab-help-short = Contest
editor-tab-errors = Erôrs
editor-tab-warnings = Avertiments
editor-tab-info = Informazions
editor-tab-accessibility = Acessibilitât
editor-tab-responses = Rispuestis mandadis

editor-tab-with-count = { $label }: { $count }

editor-options = Opzions dal editôr
editor-format-as-doenetml = Formate come DoenetML
editor-format-as-xml = Formate come XML


## The diagnostics panel

editor-diagnostic-line = Rie #{ $line }

editor-no-errors = Nissun erôr
editor-no-warnings = Nissun avertiment
editor-no-info = Nissune informazion

editor-show-info-annotations = Mostre lis informazions tal editôr
editor-show-accessibility-annotations = Mostre i avîs di acessibilitât tal editôr

editor-accessibility-learn-more = Impare cemût che Doenet al cjape sù la acessibilitât

editor-accessibility-violations-heading = Violazions di acessibilitât ({ $standard })

editor-accessibility-other-heading = Altris problemis di acessibilitât
editor-none-found = Nissun cjatât


## Submitted responses

editor-no-responses = Ancjemò nissune rispueste mandade
editor-response-answer-id = Id de rispueste
editor-response-response = Rispueste
editor-response-credit = Ponts
editor-response-submitted = Mandade


## The context-help panel

help-placeholder = Met il cursôr suntun non di tag, suntun atribût o su { $ref } pe documentazion.

help-unsupported-ref-chain = Il jutori pes riferiments a plui tocs come { $example } nol è ancjemò disponibil.

help-unresolved-ref =
    { $reason ->
        [notFound] Nissun referent cjatât pal riferiment: { $ref }.
        [multiple] Plui referents cjatâts pal riferiment: { $ref }.
       *[indeterminate] Nol è stât pussibil determinâ un referent par { $ref }.
    }

help-learn-about-references = Impare sui riferiments →
help-reference-page = Pagjine di riferiment →

help-suggestions-header =
    { $location ->
        [inside] Dentri di { $element }
       *[top] Al nivel plui alt
    }{ $allowed ->
        [none] { " — chi no va nuie." }
        [text] { " — scrîf test chi." }
        [text-and-components] { " — scrîf test chi, o prove:" }
       *[components] { " — robis di provâ:" }
    }

help-suggestions-footer = Frache { $shortcut } par viodi ducj i { $total } components.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } al è un riferiment a { $target }.
       *[other] { $ref } al è un riferiment a { $target } (rie { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introdusût di { $owner } come { $role }.
       *[other] Introdusût di { $owner } te rie { $line } come { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } al è un riferiment ae proprietât { $property } di { $element }.
       *[other] { $ref } al è un riferiment ae proprietât { $property } di { $element } (rie { $line }).
    }

help-kind-attribute = atribût
help-kind-snippet = toc di test
help-kind-array-entry = vôs di array

help-default = Predefinît:
help-active-default = Predefinît atîf:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valôrs permetûts (un par element):
       *[other] Valôrs permetûts:
    }

help-suggested-values = Valôrs conseâts:

help-inserts = Al inserìs:

help-coordinates =
    { $count ->
        [one] Coordenade:
       *[other] Coordenadis:
    }

help-type = Gjenar:

help-resolved-style = Stîl risolt (styleNumber { $styleNumber }):

help-resolved-function-names = Nons di funzion risolts:
help-reset-list = Liste di ripristin su chest input:
help-added-on-input = Zontât su chest input:
help-removed-on-input = Gjavât su chest input:

help-reset-overrides = { $reset } al passe parsore a { $additional } e { $removed }.
