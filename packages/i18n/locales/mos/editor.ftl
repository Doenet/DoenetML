# Mooré editor and language-server surfaces: the footer, the diagnostics panel,
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
        [reset] Lebs-a
       *[update] Paasg-a
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Wilgda
       *[other] { $word } Wilgda { $shortcut }
    }


## The variant picker

editor-variant = Manesem

editor-variant-filter = Yãk…

editor-variant-next = Yãk manesem sẽn pʋgende

editor-variant-previous = Yãk manesem sẽn looge


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] B yãa WCAG AA tõog-paoodg kongre. Nams n { $action ->
            [close] pag
           *[open] pak
        } tõog-paoodg rapoorã.
        [advisories] Nams n { $action ->
            [close] pag
           *[open] pak
        } tõog-paoodg rapoorã. B pa yã WCAG AA kongr ye, la keoogr a taab n be.
       *[clean] Nams n { $action ->
            [close] pag
           *[open] pak
        } tõog-paoodg rapoorã. B pa yã tõog-paoodg zu-loees ye.
    }

editor-accessibility-label =
    { $status ->
        [violations] B yãa WCAG AA tõog-paoodg kongre. { $count ->
            [one] B yãa WCAG AA kongr { $count }
           *[other] B yãa WCAG AA kongr { $count }
        }. Nams n { $action ->
            [close] pag
           *[open] pak
        } tõog-paoodg rapoorã.
        [advisories] B pa yã WCAG AA kongr ye. { $count ->
            [one] B yãa tõog-paoodg keoogr a to { $count }
           *[other] B yãa tõog-paoodg keoogr a taab { $count }
        }. Nams n { $action ->
            [close] pag
           *[open] pak
        } tõog-paoodg rapoorã.
       *[clean] B pa yã WCAG AA kongr ye. Nams n { $action ->
            [close] pag
           *[open] pak
        } tõog-paoodg rapoorã.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML vɛrsiõ { $version }

editor-tab-help = Zĩig sõngre
editor-tab-help-short = Zĩiga
editor-tab-errors = Kongre
editor-tab-warnings = Keoogre
editor-tab-info = Kibare
editor-tab-accessibility = Tõog-paoodgo
editor-tab-responses = Leoor sẽn tʋme

editor-tab-with-count = { $label }: { $count }

editor-options = Gʋlsdã yãkre
editor-format-as-doenetml = Manege wa DoenetML
editor-format-as-xml = Manege wa XML


## The diagnostics panel

editor-diagnostic-line = Sõore #{ $line }

editor-no-errors = Kongr ka be ye
editor-no-warnings = Keoogr ka be ye
editor-no-info = Kibar ka be ye

editor-show-info-annotations = Wilg kibar gʋlsdã pʋgẽ
editor-show-accessibility-annotations = Wilg tõog-paoodg keoogr gʋlsdã pʋgẽ

editor-accessibility-learn-more = Bãng Doenet sẽn mak tõog-paoodg to-to

editor-accessibility-violations-heading = Tõog-paoodg kongre ({ $standard })

editor-accessibility-other-heading = Tõog-paoodg zu-loees a taab
editor-none-found = B pa yã baa fʋɩ ye


## Submitted responses

editor-no-responses = Leoor sẽn tʋm ka be masã ye
editor-response-answer-id = Leoorã bãnde
editor-response-response = Leoore
editor-response-credit = Poẽ
editor-response-submitted = B tʋmame


## The context-help panel

help-placeholder = Ning kursoorã tag yʋʋr zug, bãnd zug, walla { $ref } zug n paam gʋlsgo.

help-unsupported-ref-chain = Sõngr sẽn kẽed babs wʋsg wilgr wa { $example } nan pa sɩng ye.

help-unresolved-ref =
    { $reason ->
        [notFound] B pa yã baa fʋɩ ne wilgr kãngã: { $ref }.
        [multiple] B yãa bũmb wʋsg ne wilgr kãngã: { $ref }.
       *[indeterminate] { $ref } sẽn wilgd bũmb ningã pa bãng ye.
    }

help-learn-about-references = Bãng wilgr rãmbã yelle →
help-reference-page = Wilgr rãmbã seb-neng →

help-suggestions-header =
    { $location ->
        [inside] { $element } pʋgẽ
       *[top] Zug sõngo
    }{ $allowed ->
        [none] { " — baa fʋɩ pa tõe n wa ka ye." }
        [text] { " — gʋls goam ka." }
        [text-and-components] { " — gʋls goam ka, walla mak:" }
       *[components] { " — babs y sẽn tõe n mak:" }
    }

help-suggestions-footer = Nams { $shortcut } n ges babs fãa { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } wilgda { $target }.
       *[other] { $ref } wilgda { $target } (sõore { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] A yita { $owner } nengẽ wa { $role }.
       *[other] A yita { $owner } nengẽ sõor { $line } zug wa { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } wilgda { $element } bãnd { $property }.
       *[other] { $ref } wilgda { $element } bãnd { $property } (sõore { $line }).
    }

help-kind-attribute = bãnde
help-kind-snippet = babg bilfu
help-kind-array-entry = kẽesg toolgã pʋgẽ

help-default = Sẽn zems fãa:
help-active-default = Sẽn zems fãa n tʋmda:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Sõdb sẽn sakame (bũmb fãa zug):
       *[other] Sõdb sẽn sakame:
    }

help-suggested-values = Sõdb sẽn wilge:

help-inserts = A kẽesda:

help-coordinates =
    { $count ->
        [one] Zĩig wilgdga:
       *[other] Zĩis wilgdba:
    }

help-type = Buudu:

help-resolved-style = Manesem sẽn yã (styleNumber { $styleNumber }):

help-resolved-function-names = Fõksiõ yʋy sẽn yã:
help-reset-list = Toolg sẽn lebs ne kẽesg kãngã:
help-added-on-input = Sẽn paas ne kẽesg kãngã:
help-removed-on-input = Sẽn yiis ne kẽesg kãngã:

help-reset-overrides = { $reset } yɩɩda { $additional } la { $removed }.
