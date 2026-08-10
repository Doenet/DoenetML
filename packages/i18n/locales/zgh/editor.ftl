# Standard Moroccan Tamazight editor and language-server surfaces: the footer,
# the diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand, in Latin letters.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ⵡⴻⵏⵏⴻⵣ
       *[update] ⵍⴻⵇⵇⴻⵎ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ⴰⵎⵙⴽⴻⵏ
       *[other] { $word } ⴰⵎⵙⴽⴻⵏ { $shortcut }
    }


## The variant picker

editor-variant = ⵜⴰⵍⵖⴰ

editor-variant-filter = ⵙⵉⵣⴷⴻⴳ…

editor-variant-next = ⴼⵔⴻⵏ ⵜⴰⵍⵖⴰ ⵉ ⴷ-ⵉⵜⴻⴷⴷⵓⵏ

editor-variant-previous = ⴼⵔⴻⵏ ⵜⴰⵍⵖⴰ ⵢⴻⵣⵔⵉⵏ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] ⵢⴻⵜⵜⵡⴰⴼ ⵓⵣⴳⴰⵔ WCAG AA ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ. ⵙⵉⵜ ⴰⴽⴽⴻⵏ ⴰⴷ { $action ->
            [close] ⵜⵎⴻⴷⵍⴻⴷ
           *[open] ⵜⴻⵍⴷⵉⴷ
        } ⴰⵏⴻⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ.
        [advisories] ⵙⵉⵜ ⴰⴽⴽⴻⵏ ⴰⴷ { $action ->
            [close] ⵜⵎⴻⴷⵍⴻⴷ
           *[open] ⵜⴻⵍⴷⵉⴷ
        } ⴰⵏⴻⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ. ⵓⵍⴰⵛ ⴰⵣⴳⴰⵔ WCAG AA ⵢⴻⵜⵜⵡⴰⴼⴻⵏ, ⵎⴰⵛⴰ ⵍⵍⴰⵏ ⵢⵉⵏⴻⵖⵎⵉⵙⴻⵏ ⵏⵏⵉⴹⴻⵏ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ.
       *[clean] ⵙⵉⵜ ⴰⴽⴽⴻⵏ ⴰⴷ { $action ->
            [close] ⵜⵎⴻⴷⵍⴻⴷ
           *[open] ⵜⴻⵍⴷⵉⴷ
        } ⴰⵏⴻⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ. ⵓⵍⴰⵛ ⵓⴳⵓⵔⴻⵏ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ ⵢⴻⵜⵜⵡⴰⴼⴻⵏ.
    }

editor-accessibility-label =
    { $status ->
        [violations] ⵢⴻⵜⵜⵡⴰⴼ ⵓⵣⴳⴰⵔ WCAG AA ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ. { $count ->
            [one] ⵢⴻⵜⵜⵡⴰⴼ { $count } ⵏ ⵓⵣⴳⴰⵔ WCAG AA
           *[other] ⵜⵜⵡⴰⴼⴻⵏ { $count } ⵏ ⵢⵉⵣⴳⴰⵔⴻⵏ WCAG AA
        }. ⵙⵉⵜ ⴰⴽⴽⴻⵏ ⴰⴷ { $action ->
            [close] ⵜⵎⴻⴷⵍⴻⴷ
           *[open] ⵜⴻⵍⴷⵉⴷ
        } ⴰⵏⴻⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ.
        [advisories] ⵓⵍⴰⵛ ⴰⵣⴳⴰⵔ WCAG AA ⵢⴻⵜⵜⵡⴰⴼⴻⵏ. { $count ->
            [one] ⵢⴻⵜⵜⵡⴰⴼ { $count } ⵏ ⵓⵏⴻⵖⵎⵉⵙ ⵏⵏⵉⴹⴻⵏ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ
           *[other] ⵜⵜⵡⴰⴼⴻⵏ { $count } ⵏ ⵢⵉⵏⴻⵖⵎⵉⵙⴻⵏ ⵏⵏⵉⴹⴻⵏ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ
        }. ⵙⵉⵜ ⴰⴽⴽⴻⵏ ⴰⴷ { $action ->
            [close] ⵜⵎⴻⴷⵍⴻⴷ
           *[open] ⵜⴻⵍⴷⵉⴷ
        } ⴰⵏⴻⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ.
       *[clean] ⵓⵍⴰⵛ ⴰⵣⴳⴰⵔ WCAG AA ⵢⴻⵜⵜⵡⴰⴼⴻⵏ. ⵙⵉⵜ ⴰⴽⴽⴻⵏ ⴰⴷ { $action ->
            [close] ⵜⵎⴻⴷⵍⴻⴷ
           *[open] ⵜⴻⵍⴷⵉⴷ
        } ⴰⵏⴻⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = ⵍⵇⴻⵎ DoenetML { $version }

editor-tab-help = ⵜⴰⵍⵍⴰⵍⵜ ⵏ ⵡⴰⴷⴻⴳ
editor-tab-help-short = ⴰⴷⴻⴳ
editor-tab-errors = ⵜⵓⵛⵛⴹⵉⵡⵉⵏ
editor-tab-warnings = ⵉⵍⵖⴰ
editor-tab-info = ⵜⴰⵍⵖⵓⵜ
editor-tab-accessibility = ⴰⵏⴻⴽⵛⵓⵎ
editor-tab-responses = ⵜⵉⵔⵉⵔⵉⵢⵉⵏ ⵢⴻⵜⵜⵡⴰⵣⵏⴻⵏ

editor-tab-with-count = { $label }: { $count }

editor-options = ⵜⵉⵏⴻⴼⵔⵓⵏⵉⵏ ⵏ ⵓⵎⴰⵥⵔⴰⴳ
editor-format-as-doenetml = ⵎⵙⴻⵍ ⴰⵎ DoenetML
editor-format-as-xml = ⵎⵙⴻⵍ ⴰⵎ XML


## The diagnostics panel

editor-diagnostic-line = ⵉⵣⵉⵔⵉⴳ #{ $line }

editor-no-errors = ⵓⵍⴰⵛ ⵜⵓⵛⵛⴹⵉⵡⵉⵏ
editor-no-warnings = ⵓⵍⴰⵛ ⵉⵍⵖⴰ
editor-no-info = ⵓⵍⴰⵛ ⵜⴰⵍⵖⵓⵜ

editor-show-info-annotations = ⵙⴽⴻⵏ ⵜⴰⵍⵖⵓⵜ ⴷⴻⴳ ⵓⵎⴰⵥⵔⴰⴳ
editor-show-accessibility-annotations = ⵙⴽⴻⵏ ⵉⵍⵖⴰ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ ⴷⴻⴳ ⵓⵎⴰⵥⵔⴰⴳ

editor-accessibility-learn-more = ⵍⵎⴻⴷ ⴰⵎⴻⴽ ⵉ ⵜⵡⴰⵍⵉ Doenet ⴰⵏⴻⴽⵛⵓⵎ

editor-accessibility-violations-heading = ⵉⵣⴳⴰⵔⴻⵏ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ ({ $standard })

editor-accessibility-other-heading = ⵓⴳⵓⵔⴻⵏ ⵏⵏⵉⴹⴻⵏ ⵏ ⵡⴰⵏⴻⴽⵛⵓⵎ
editor-none-found = ⵓⵍⴰⵛ ⴰⵛⴻⵎⵎⴰ ⵢⴻⵜⵜⵡⴰⴼⴻⵏ


## Submitted responses

editor-no-responses = ⵓⵍⴰⵛ ⵜⵉⵔⵉⵔⵉⵢⵉⵏ ⵢⴻⵜⵜⵡⴰⵣⵏⴻⵏ ⴰⵔ ⵜⵓⵔⴰ
editor-response-answer-id = ⴰⵙⵓⵍⴰⵢ ⵏ ⵜⵔⵉⵔⵉⵜ
editor-response-response = ⵜⵉⵔⵉⵔⵉⵜ
editor-response-credit = ⵜⵉⵏⵇⵉⴹⵉⵏ
editor-response-submitted = ⵜⴻⵜⵜⵡⴰⵣⴻⵏ


## The context-help panel

help-placeholder = ⴻⵔⵔ ⵜⴰⵃⵏⴰⵛⵛⴰⴹ ⵅⴼ ⵢⵉⵙⴻⵎ ⵏ ⵜⴻⴱⵣⵉⵎⵜ, ⵅⴼ ⵓⵎⴻⵙⵍⴰⵢ, ⵏⴻⵖ ⵅⴼ { $ref } ⵉ ⵜⵙⴻⵎⵍⵉⵜ.

help-unsupported-ref-chain = ⵜⴰⵍⵍⴰⵍⵜ ⵏ ⵜⵎⴻⵖⵕⵉⵡⵉⵏ ⵙ ⵡⴰⵟⴰⵙ ⵏ ⵢⵉⵃⵔⵉⵛⴻⵏ ⴰⵎ { $example } ⵎⴰⵣⴰⵍ ⵓⵔ ⵜⴻⵍⵍⵉ ⴰⵔⴰ.

help-unresolved-ref =
    { $reason ->
        [notFound] ⵓⵍⴰⵛ ⴰⵛⴻⵎⵎⴰ ⵢⴻⵜⵜⵡⴰⴼⴻⵏ ⵉ ⵜⵎⴻⵖⵕⵉⵜ-ⴰ: { $ref }.
        [multiple] ⵜⵜⵡⴰⴼⴻⵏ ⵡⴰⵟⴰⵙ ⵏ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵉ ⵜⵎⴻⵖⵕⵉⵜ-ⴰ: { $ref }.
       *[indeterminate] ⴰⵢⴻⵏ ⵉ ⴷ-ⵜⴻⵙⵙⴻⵏⵜⴰ { $ref } ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵜⵜⵡⴰⵙⵙⴻⵏ.
    }

help-learn-about-references = ⵍⵎⴻⴷ ⵅⴼ ⵜⵎⴻⵖⵕⵉⵡⵉⵏ →
help-reference-page = ⴰⵙⴻⴱⵜⴻⵔ ⵏ ⵜⵎⴻⵖⵕⵉⵜ →

help-suggestions-header =
    { $location ->
        [inside] ⴷⴻⴳ { $element }
       *[top] ⴷⴻⴳ ⵓⵙⵡⵉⵔ ⴰⴼⴻⵍⵍⴰⵢ
    }{ $allowed ->
        [none] { " — ⵓⵍⴰⵛ ⴰⵢⴻⵏ ⴰⵔⴰ ⵢⴻⴷⴷⵓⵏ ⴷⴰ." }
        [text] { " — ⴰⵔⵓ ⴰⴹⵔⵉⵙ ⴷⴰ." }
        [text-and-components] { " — ⴰⵔⵓ ⴰⴹⵔⵉⵙ ⴷⴰ, ⵏⴻⵖ ⵄⵔⴻⴹ:" }
       *[components] { " — ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⴰⵔⴰ ⵜⵄⴻⵔⴹⴻⴷ:" }
    }

help-suggestions-footer = ⵙⵉⵜ { $shortcut } ⵉ ⵡⴰⴽⴽⴻⵏ ⴰⴷ ⵜⵡⴰⵍⵉⴷ { $total } ⵏ ⵢⵉⴼⴻⵔⴷⵉⵙⴻⵏ ⵎⴻⵕⵕⴰ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ⴷ ⵜⴰⵎⴻⵖⵕⵉⵜ ⵖⴻⵔ { $target }.
       *[other] { $ref } ⴷ ⵜⴰⵎⴻⵖⵕⵉⵜ ⵖⴻⵔ { $target } (ⵉⵣⵉⵔⵉⴳ { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] ⵜⴻⵜⵜⵡⴰⵔⵏⴰ-ⴷ ⵙ { $owner } ⴰⵎ { $role }.
       *[other] ⵜⴻⵜⵜⵡⴰⵔⵏⴰ-ⴷ ⵙ { $owner } ⴷⴻⴳ ⵢⵉⵣⵉⵔⵉⴳ { $line } ⴰⵎ { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ⴷ ⵜⴰⵎⴻⵖⵕⵉⵜ ⵖⴻⵔ ⵓⵎⴻⵙⵍⴰⵢ { $property } ⵏ { $element }.
       *[other] { $ref } ⴷ ⵜⴰⵎⴻⵖⵕⵉⵜ ⵖⴻⵔ ⵓⵎⴻⵙⵍⴰⵢ { $property } ⵏ { $element } (ⵉⵣⵉⵔⵉⴳ { $line }).
    }

help-kind-attribute = ⴰⵎⴻⵙⵍⴰⵢ
help-kind-snippet = ⴰⴳⵣⵓⵎ
help-kind-array-entry = ⴰⵏⴻⴽⵛⵓⵎ ⴷⴻⴳ ⵓⵎⵓⵖ

help-default = ⴰⵎⴻⵣⵡⴻⵔ:
help-active-default = ⴰⵎⴻⵣⵡⴻⵔ ⵓⵔⵎⵉⴷ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ⴰⵣⴰⵍⴻⵏ ⵢⴻⵜⵜⵓⵙⵉⵔⴳⴻⵏ (ⵢⵉⵡⴻⵏ ⵉ ⵢⴰⵍ ⵜⴰⵖⴰⵡⵙⴰ):
       *[other] ⴰⵣⴰⵍⴻⵏ ⵢⴻⵜⵜⵓⵙⵉⵔⴳⴻⵏ:
    }

help-suggested-values = ⴰⵣⴰⵍⴻⵏ ⵢⴻⵜⵜⵡⴰⵙⵓⵎⵔⴻⵏ:

help-inserts = ⵢⴻⵙⴻⴽⵛⴰⵎ:

help-coordinates =
    { $count ->
        [one] ⵜⴰⵎⵙⵉⴷⴻⴳⵜ:
       *[other] ⵜⵉⵎⵙⵉⴷⴻⴳⵉⵏ:
    }

help-type = ⴰⵏⴰⵡ:

help-resolved-style = ⴰⵖⴰⵏⵉⴱ ⵢⴻⵜⵜⵡⴰⴼⴻⵏ (styleNumber { $styleNumber }):

help-resolved-function-names = ⵉⵙⵎⴰⵡⴻⵏ ⵏ ⵜⵡⵓⵔⵉⵡⵉⵏ ⵢⴻⵜⵜⵡⴰⴼⴻⵏ:
help-reset-list = ⴰⵎⵓⵖ ⵢⴻⵜⵜⵡⴰⵡⴻⵏⵏⵣⴻⵏ ⴷⴻⴳ ⵓⵏⴻⴽⵛⵓⵎ-ⴰ:
help-added-on-input = ⴰⵢⴻⵏ ⵢⴻⵜⵜⵡⴰⵔⵏⴰⵏ ⴷⴻⴳ ⵓⵏⴻⴽⵛⵓⵎ-ⴰ:
help-removed-on-input = ⴰⵢⴻⵏ ⵢⴻⵜⵜⵡⴰⴽⴽⵙⴻⵏ ⴷⴻⴳ ⵓⵏⴻⴽⵛⵓⵎ-ⴰ:

help-reset-overrides = { $reset } ⵢⴻⵣⵡⴰⵔ { $additional } ⴷ { $removed }.
