# Mandinka editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Murundi
       *[update] Kutayandi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Yitandirilaa
       *[other] { $word } Yitandirilaa { $shortcut }
    }


## The variant picker

editor-variant = Siifaa

editor-variant-filter = Tomboŋ…

editor-variant-next = Siifaa meŋ ka naa tomboŋ

editor-variant-previous = Siifaa meŋ tambita tomboŋ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA futandiroo tambiroo jeta. A bito ka futandiroo kibaaroo { $action ->
            [close] soroŋ
           *[open] yele
        }.
        [advisories] A bito ka futandiroo kibaaroo { $action ->
            [close] soroŋ
           *[open] yele
        }. WCAG AA tambiroo maŋ je, bari dandalaari doolu be jee.
       *[clean] A bito ka futandiroo kibaaroo { $action ->
            [close] soroŋ
           *[open] yele
        }. Futandiroo bataa maŋ je.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA futandiroo tambiroo jeta. { $count ->
            [one] WCAG AA tambiroo { $count } jeta
           *[other] WCAG AA tambiroo { $count } jeta
        }. A bito ka futandiroo kibaaroo { $action ->
            [close] soroŋ
           *[open] yele
        }.
        [advisories] WCAG AA tambiroo maŋ je. { $count ->
            [one] Futandiroo dandalaari doo { $count } jeta
           *[other] Futandiroo dandalaari doolu { $count } jeta
        }. A bito ka futandiroo kibaaroo { $action ->
            [close] soroŋ
           *[open] yele
        }.
       *[clean] WCAG AA tambiroo maŋ je. A bito ka futandiroo kibaaroo { $action ->
            [close] soroŋ
           *[open] yele
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML siifaa { $version }

editor-tab-help = Dulaa maakoyiroo
editor-tab-help-short = Dulaa
editor-tab-errors = Filoolu
editor-tab-warnings = Dandalaaroolu
editor-tab-info = Kibaaroo
editor-tab-accessibility = Futandiroo
editor-tab-responses = Jaabiri kiiriŋolu

editor-tab-with-count = { $label }: { $count }

editor-options = Safeerilaa tombondiroo
editor-format-as-doenetml = A parendi ko DoenetML
editor-format-as-xml = A parendi ko XML


## The diagnostics panel

editor-diagnostic-line = Laayinoo #{ $line }

editor-no-errors = Filoo Te Jee
editor-no-warnings = Dandalaaroo Te Jee
editor-no-info = Kibaaroo Te Jee

editor-show-info-annotations = Kibaaroo yitandi safeerilaa kono
editor-show-accessibility-annotations = Futandiroo dandalaaroolu yitandi safeerilaa kono

editor-accessibility-learn-more = Doenet ka futandiroo sumaŋ ñaameŋ, a loŋ

editor-accessibility-violations-heading = Futandiroo tambiroolu ({ $standard })

editor-accessibility-other-heading = Futandiroo bataa doolu
editor-none-found = Feŋ maŋ je


## Submitted responses

editor-no-responses = Jaabiri kiiriŋo te jee saayiŋ
editor-response-answer-id = Jaabiroo too
editor-response-response = Jaabiroo
editor-response-credit = Poyintoolu
editor-response-submitted = A kiita


## The context-help panel

help-placeholder = Kursoo landi tagoo too kaŋ, taamanseeroo kaŋ, waraŋ { $ref } kaŋ ka safeeroo soto.

help-unsupported-ref-chain = Maakoyiroo meŋ be karoo jamaa yitandiroo to ko { $example }, wo maŋ dati foloo.

help-unresolved-ref =
    { $reason ->
        [notFound] Feŋ maŋ je ñiŋ yitandiroo to: { $ref }.
        [multiple] Feŋ jamaa jeta ñiŋ yitandiroo to: { $ref }.
       *[indeterminate] { $ref } ye meŋ yitandi, wo maŋ loŋ.
    }

help-learn-about-references = Yitandiroolu kuwo loŋ →
help-reference-page = Yitandiroolu karataa →

help-suggestions-header =
    { $location ->
        [inside] { $element } kono
       *[top] Santo baa
    }{ $allowed ->
        [none] { " — feŋ te naa noo la jaŋ." }
        [text] { " — kumakaŋolu safee jaŋ." }
        [text-and-components] { " — kumakaŋolu safee jaŋ, waraŋ i ye ñiŋ kata:" }
       *[components] { " — karoolu i si meŋ kata:" }
    }

help-suggestions-footer = { $shortcut } bito ka karoolu bee je { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ye { $target } yitandi.
       *[other] { $ref } ye { $target } yitandi (laayinoo { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] A bota { $owner } bala ko { $role }.
       *[other] A bota { $owner } bala laayinoo { $line } to ko { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ye { $element } taamanseeroo { $property } yitandi.
       *[other] { $ref } ye { $element } taamanseeroo { $property } yitandi (laayinoo { $line }).
    }

help-kind-attribute = taamanseeroo
help-kind-snippet = kar ndiŋo
help-kind-array-entry = duŋo tembendiroo kono

help-default = Meŋ be jee foloo:
help-active-default = Meŋ be jee foloo aniŋ a ka dookuu:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Konteroolu meŋ soobeeyaata (feŋ-wo-feŋ kaŋ):
       *[other] Konteroolu meŋ soobeeyaata:
    }

help-suggested-values = Konteroolu meŋ fota:

help-inserts = A ka ñiŋ duŋ:

help-coordinates =
    { $count ->
        [one] Dulaa yitandirilaa:
       *[other] Dulaalu yitandirilaalu:
    }

help-type = Siifaa:

help-resolved-style = Siifaa meŋ jeta (styleNumber { $styleNumber }):

help-resolved-function-names = Fankisoŋ too jeriŋolu:
help-reset-list = Tembendiroo murundita ñiŋ duŋo la:
help-added-on-input = Meŋ lafaata ñiŋ duŋo la:
help-removed-on-input = Meŋ bondita ñiŋ duŋo la:

help-reset-overrides = { $reset } ye { $additional } niŋ { $removed } tambi.
