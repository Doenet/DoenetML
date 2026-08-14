# Luo editor and language-server surfaces: the footer, the diagnostics panel,
# the variant picker, the accessibility button, and the context-help panel
# beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Duog
       *[update] Manyi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Janyis
       *[other] { $word } Janyis { $shortcut }
    }


## The variant picker

editor-variant = Kit

editor-variant-filter = Yier…

editor-variant-next = Yier kit maluwo

editor-variant-previous = Yier kit mokalo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Oyud ketho chik mar WCAG AA mar chopo. Dii mondo { $action ->
            [close] iumo
           *[open] iyaw
        } ripot mar chopo.
        [advisories] Dii mondo { $action ->
            [close] iumo
           *[open] iyaw
        } ripot mar chopo. Onge ketho chik mar WCAG AA moyudi, to nitie puonj mamoko mag chopo.
       *[clean] Dii mondo { $action ->
            [close] iumo
           *[open] iyaw
        } ripot mar chopo. Onge chandruok mag chopo moyudi.
    }

editor-accessibility-label =
    { $status ->
        [violations] Oyud ketho chik mar WCAG AA mar chopo. Oyudi { $count ->
            [one] ketho chik mar WCAG AA { $count }
           *[other] ketho chik mar WCAG AA { $count }
        }. Dii mondo { $action ->
            [close] iumo
           *[open] iyaw
        } ripot mar chopo.
        [advisories] Onge ketho chik mar WCAG AA moyudi. Oyudi { $count ->
            [one] puonj machielo mar chopo { $count }
           *[other] puonj mamoko mag chopo { $count }
        }. Dii mondo { $action ->
            [close] iumo
           *[open] iyaw
        } ripot mar chopo.
       *[clean] Onge ketho chik mar WCAG AA moyudi. Dii mondo { $action ->
            [close] iumo
           *[open] iyaw
        } ripot mar chopo.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Kit DoenetML mar { $version }

editor-tab-help = Kony mar kama iking'iyoe
editor-tab-help-short = Kama
editor-tab-errors = Bayo
editor-tab-warnings = Siem
editor-tab-info = Weche
editor-tab-accessibility = Chopo
editor-tab-responses = Duoko moor

editor-tab-with-count = { $label }: { $count }

editor-options = Yiero mag jandiko
editor-format-as-doenetml = Chan kaka DoenetML
editor-format-as-xml = Chan kaka XML


## The diagnostics panel

editor-diagnostic-line = Laini #{ $line }

editor-no-errors = Onge Bayo
editor-no-warnings = Onge Siem
editor-no-info = Onge Weche

editor-show-info-annotations = Nyis weche e jandiko
editor-show-accessibility-annotations = Nyis siem mag chopo e jandiko

editor-accessibility-learn-more = Puonjri kaka Doenet neno wach chopo

editor-accessibility-violations-heading = Ketho chik mag chopo ({ $standard })

editor-accessibility-other-heading = Chandruok mamoko mag chopo
editor-none-found = Onge gima oyudi


## Submitted responses

editor-no-responses = Onge duoko moor nyaka sani
editor-response-answer-id = Aidi mar Duoko
editor-response-response = Duoko
editor-response-credit = Point
editor-response-submitted = Oor


## The context-help panel

help-placeholder = Ket kesa e nying tag, e alama, kata e { $ref } mondo iyud ndiko.

help-unsupported-ref-chain = Kony mar ranyisi man-gi bethe mang'eny kaka { $example } pok oyudi.

help-unresolved-ref =
    { $reason ->
        [notFound] Onge gima oyudi kuom ranyisini: { $ref }.
        [multiple] Oyud gik mang'eny kuom ranyisini: { $ref }.
       *[indeterminate] Gima { $ref } nyiso ok nyal fwenyore.
    }

help-learn-about-references = Puonjri kuom ranyisi →
help-reference-page = Ich mar ranyisi →

help-suggestions-header =
    { $location ->
        [inside] Ei { $element }
       *[top] E wi gik moko duto
    }{ $allowed ->
        [none] { " — onge gima dhi kae." }
        [text] { " — ndik weche kae." }
        [text-and-components] { " — ndik weche kae, kata item:" }
       *[components] { " — gik ma inyalo temo:" }
    }

help-suggestions-footer = Dii { $shortcut } mondo ine bethe duto { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } en ranyisi mar { $target }.
       *[other] { $ref } en ranyisi mar { $target } (laini { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Nokel gi { $owner } kaka { $role }.
       *[other] Nokel gi { $owner } e laini { $line } kaka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } en ranyisi mar alama mar { $property } mar { $element }.
       *[other] { $ref } en ranyisi mar alama mar { $property } mar { $element } (laini { $line }).
    }

help-kind-attribute = alama
help-kind-snippet = bath ndiko
help-kind-array-entry = donjo e chenro

help-default = Machon:
help-active-default = Machon matiyo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Kwan moyie (achiel kuom gimoro amora):
       *[other] Kwan moyie:
    }

help-suggested-values = Kwan mopar:

help-inserts = Oketo:

help-coordinates =
    { $count ->
        [one] Ranyisi kar:
       *[other] Ranyisi kar:
    }

help-type = Kit:

help-resolved-style = Kit moyud (styleNumber { $styleNumber }):

help-resolved-function-names = Nying tije moyud:
help-reset-list = Chenro moduog e donjoni:
help-added-on-input = Gima omedi e donjoni:
help-removed-on-input = Gima ogol e donjoni:

help-reset-overrides = { $reset } loyo { $additional } gi { $removed }.
