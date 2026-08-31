# Northern Frisian (Nordfriisk) editor and language-server surfaces, in the
# **Mooring** variety (Frasch, Bökingharde): the footer, the diagnostics panel,
# the variant picker, the accessibility button and the context-help panel.
# Selected by `uiLocale`.
#
# Translated from `locales/en/editor.ftl`, which is the source of truth.
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script. **`frr` is a tag over a cluster of
# dialects, not one language with one spelling**: Mooring, Fering, Öömrang,
# Sölring and the Halligfrasch, Wiedingharder and Karrharder varieties each
# have their own orthography. This file is **Mooring**, following the
# *Frasch-Tjüsch Uurdebök* (Sjölin, Århammar & Wilts, Nordfriisk Instituut) and
# the Mooring school grammar. See `chrome.ftl` for the full note.
#
# **What is the language's own**: «as» / «san», the negator «ai», «nian» for
# *none*, «nönt» for *nothing*, «än», «of», «wan», «wiil», «tobääg», «riege»
# for the editor's line, «fäler» for *error*, «wise» for *show*.
#
# **What is borrowed**: the editor's technical nouns — «atribut», «referens»,
# «komponänt», «dokumentatjoon», «kursoor» — are German respelled to Mooring,
# because German is the language a North Frisian speaker is schooled in. That
# is where a reviewer should start.
#
# **Counts.** CLDR has **no plural data for `frr`**, so no plural category can
# be selected: this file writes **no** `[zero]`, `[one]`, `[two]`, `[few]` or
# `[many]` branch anywhere. `editor-accessibility-label` and `help-coordinates`
# therefore carry one form each rather than English's singular/plural split.
#
# **Digits.** Every number renders in Latin digits.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`. Every
# symbolic selector — `$action`, `$status`, `$shortcut`, `$reason`,
# `$location`, `$allowed`, `$line`, `$perItem` — is kept byte for byte from
# English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Tobäägsäte
       *[update] Nayeere
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Jü wisang { $word }
       *[other] Jü wisang { $word } { $shortcut }
    }


## The variant picker

editor-variant = Wariant
editor-variant-filter = Filtre …
editor-variant-next = Naist wariant ütsääke
editor-variant-previous = Föörii wariant ütsääke


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Der as en ferstoos juun WCAG AA fünen wurden. Klike, am dåt bericht tu jü tugöngelkhaid { $action ->
            [close] tuutumåågen
           *[open] iepentumåågen
        }.
        [advisories] Klike, am dåt bericht tu jü tugöngelkhaid { $action ->
            [close] tuutumåågen
           *[open] iepentumåågen
        }. Der san nian WCAG-AA-ferstoose fünen wurden, man der jeft widere räädslaie tu jü tugöngelkhaid.
       *[clean] Klike, am dåt bericht tu jü tugöngelkhaid { $action ->
            [close] tuutumåågen
           *[open] iepentumåågen
        }. Der san nian problemer ma jü tugöngelkhaid fünen wurden.
    }

# One form for the count: CLDR has no plural rules for `frr`.
editor-accessibility-label =
    { $status ->
        [violations] Der as en ferstoos juun WCAG AA fünen wurden. Der san { $count } WCAG-AA-ferstoose fünen wurden. Klike, am dåt bericht tu jü tugöngelkhaid { $action ->
            [close] tuutumåågen
           *[open] iepentumåågen
        }.
        [advisories] Der san nian WCAG-AA-ferstoose fünen wurden. Der san { $count } widere räädslaie tu jü tugöngelkhaid fünen wurden. Klike, am dåt bericht tu jü tugöngelkhaid { $action ->
            [close] tuutumåågen
           *[open] iepentumåågen
        }.
       *[clean] Der san nian WCAG-AA-ferstoose fünen wurden. Klike, am dåt bericht tu jü tugöngelkhaid { $action ->
            [close] tuutumåågen
           *[open] iepentumåågen
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-wersjoon { $version }

editor-tab-help = Heelp tu't kontäkst
editor-tab-help-short = Kontäkst
editor-tab-errors = Fälern
editor-tab-warnings = Waarnange
editor-tab-info = Info
editor-tab-accessibility = Tugöngelkhaid
editor-tab-responses = Stjüürd aantwurde

editor-tab-with-count = { $label }: { $count }

editor-options = Editoor-optioone
editor-format-as-doenetml = As DoenetML formatiare
editor-format-as-xml = As XML formatiare


## The diagnostics panel

editor-diagnostic-line = Riege #{ $line }

editor-no-errors = Nian fälern
editor-no-warnings = Nian waarnange
editor-no-info = Nian info-diagnoose

editor-show-info-annotations = Info-diagnoose önj di editoor wise
editor-show-accessibility-annotations = Diagnoose tu jü tugöngelkhaid önj di editoor wise

editor-accessibility-learn-more = Hü Doenet jü tugöngelkhaid ounpaket

editor-accessibility-violations-heading = Ferstoose juun jü tugöngelkhaid ({ $standard })

editor-accessibility-other-heading = Uur problemer ma jü tugöngelkhaid
editor-none-found = Nönt fünen


## Submitted responses

editor-no-responses = Nuch nian aantwurde stjüürd
editor-response-answer-id = Aantwurd-id
editor-response-response = Aantwurd
editor-response-credit = Pungte
editor-response-submitted = Stjüürd


## The context-help panel

help-placeholder = Di kursoor üüb en tag-noome, en atribut of { $ref } säte för jü dokumentatjoon.

help-unsupported-ref-chain = Heelp tu määrdiili referense as { $example } jeft dåt nuch ai.

help-unresolved-ref =
    { $reason ->
        [notFound] Nian betäägen för jü referens fünen: { $ref }.
        [multiple] Moor betäägen för jü referens fünen: { $ref }.
       *[indeterminate] En betäägen för { $ref } hää ai fäästleit wårde koon.
    }

help-learn-about-references = Mör auer referense weete →
help-reference-page = Referenssidj →

help-suggestions-header =
    { $location ->
        [inside] Önjbinen { $element }
       *[top] Üüb dåt böögest neewo
    }{ $allowed ->
        [none] { " — hir hiart nönt hän." }
        [text] { " — hir täkst iinjdreege." }
        [text-and-components] { " — hir täkst iinjdreege, of dåt prowe:" }
       *[components] { " — tu't prowen:" }
    }

help-suggestions-footer = { $shortcut } drüke, am ål { $total } komponänte tu sään.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } as en referens üüb { $target }.
       *[other] { $ref } as en referens üüb { $target } (riege { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Iinjfjart foon { $owner } as { $role }.
       *[other] Iinjfjart foon { $owner } üüb riege { $line } as { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } as en referens üüb jü ienskap { $property } foon { $element }.
       *[other] { $ref } as en referens üüb jü ienskap { $property } foon { $element } (riege { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = täkstbüsel
help-kind-array-entry = array-iinjdrach

help-default = Standardwäärd:
help-active-default = Aktiif standardwäärd:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tuulätene wäärde (ån per element):
       *[other] Tuulätene wäärde:
    }

help-suggested-values = Fäärslüne wäärde:

help-inserts = Sat iin:

# One form for the count: CLDR has no plural rules for `frr`.
help-coordinates = Koordinaate:

help-type = Slach:

help-resolved-style = Aptäält stiil (styleNumber { $styleNumber }):

help-resolved-function-names = Aptäält funktjoonsnoome:
help-reset-list = Tobäägsäte-lasst bai jü iinjgoow:
help-added-on-input = Bai jü iinjgoow tuufäid:
help-removed-on-input = Bai jü iinjgoow wächnümen:

help-reset-overrides = { $reset } gungt föör { $additional } än { $removed }.
