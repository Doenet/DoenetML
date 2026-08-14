# Tachelhit editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# The counted branches here write `one`, `few` and `other`; see `content.ftl`'s
# header.
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand, in Latin letters.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ⵔⴰⵔ
       *[update] ⵙⵎⴰⵢⵏⵓ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ⴰⵎⵙⴽⵏ
       *[other] { $word } ⴰⵎⵙⴽⵏ { $shortcut }
    }


## The variant picker

editor-variant = ⵜⴰⵍⵖⴰ

editor-variant-filter = ⵙⵉⵣⴷⴳ…

editor-variant-next = ⵙⵜⵉ ⵜⴰⵍⵖⴰ ⴷ ⵉⴷⴷⴰⵏ

editor-variant-previous = ⵙⵜⵉ ⵜⴰⵍⵖⴰ ⵉⵣⵔⵉⵏ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] ⵢⵜⵜⵓⴼ ⵓⵣⴳⴰⵔ WCAG AA ⵏ ⵡⴰⵏⴽⵛⵓⵎ. ⵙⵉⵜ ⴰⴼⴰⴷ ⴰⴷ { $action ->
            [close] ⵜⵇⵇⵏⵜ
           *[open] ⵜⵔⵣⵎⵜ
        } ⴰⵏⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴽⵛⵓⵎ.
        [advisories] ⵙⵉⵜ ⴰⴼⴰⴷ ⴰⴷ { $action ->
            [close] ⵜⵇⵇⵏⵜ
           *[open] ⵜⵔⵣⵎⵜ
        } ⴰⵏⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴽⵛⵓⵎ. ⵓⵔ ⵉⵍⵍⵉ ⵓⵣⴳⴰⵔ WCAG AA ⵢⵜⵜⵓⴼⴰⵏ, ⵎⴰⵛⴰ ⵍⵍⴰⵏ ⵢⵉⵏⵖⵎⵉⵙⵏ ⵢⴰⴹⵏⵉⵏ ⵏ ⵡⴰⵏⴽⵛⵓⵎ.
       *[clean] ⵙⵉⵜ ⴰⴼⴰⴷ ⴰⴷ { $action ->
            [close] ⵜⵇⵇⵏⵜ
           *[open] ⵜⵔⵣⵎⵜ
        } ⴰⵏⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴽⵛⵓⵎ. ⵓⵔ ⵜⵜⵓⴼⵏ ⵓⴳⵓⵔⵏ ⵏ ⵡⴰⵏⴽⵛⵓⵎ.
    }

editor-accessibility-label =
    { $status ->
        [violations] ⵢⵜⵜⵓⴼ ⵓⵣⴳⴰⵔ WCAG AA ⵏ ⵡⴰⵏⴽⵛⵓⵎ. { $count ->
            [one] ⵢⵜⵜⵓⴼ { $count } ⵏ ⵓⵣⴳⴰⵔ WCAG AA
            [few] ⵜⵜⵓⴼⵏ { $count } ⵏ ⵢⵉⵣⴳⴰⵔⵏ WCAG AA
           *[other] ⵜⵜⵓⴼⵏ { $count } ⵏ ⵢⵉⵣⴳⴰⵔⵏ WCAG AA
        }. ⵙⵉⵜ ⴰⴼⴰⴷ ⴰⴷ { $action ->
            [close] ⵜⵇⵇⵏⵜ
           *[open] ⵜⵔⵣⵎⵜ
        } ⴰⵏⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴽⵛⵓⵎ.
        [advisories] ⵓⵔ ⵉⵍⵍⵉ ⵓⵣⴳⴰⵔ WCAG AA ⵢⵜⵜⵓⴼⴰⵏ. { $count ->
            [one] ⵢⵜⵜⵓⴼ { $count } ⵏ ⵓⵏⵖⵎⵉⵙ ⵢⴰⴹⵏⵉⵏ ⵏ ⵡⴰⵏⴽⵛⵓⵎ
            [few] ⵜⵜⵓⴼⵏ { $count } ⵏ ⵢⵉⵏⵖⵎⵉⵙⵏ ⵢⴰⴹⵏⵉⵏ ⵏ ⵡⴰⵏⴽⵛⵓⵎ
           *[other] ⵜⵜⵓⴼⵏ { $count } ⵏ ⵢⵉⵏⵖⵎⵉⵙⵏ ⵢⴰⴹⵏⵉⵏ ⵏ ⵡⴰⵏⴽⵛⵓⵎ
        }. ⵙⵉⵜ ⴰⴼⴰⴷ ⴰⴷ { $action ->
            [close] ⵜⵇⵇⵏⵜ
           *[open] ⵜⵔⵣⵎⵜ
        } ⴰⵏⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴽⵛⵓⵎ.
       *[clean] ⵓⵔ ⵉⵍⵍⵉ ⵓⵣⴳⴰⵔ WCAG AA ⵢⵜⵜⵓⴼⴰⵏ. ⵙⵉⵜ ⴰⴼⴰⴷ ⴰⴷ { $action ->
            [close] ⵜⵇⵇⵏⵜ
           *[open] ⵜⵔⵣⵎⵜ
        } ⴰⵏⵇⵇⵉⵙ ⵏ ⵡⴰⵏⴽⵛⵓⵎ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = ⵍⵇⵎ DoenetML { $version }

editor-tab-help = ⵜⴰⵍⵍⴰⵍⵜ ⵏ ⵡⴰⴷⴳ
editor-tab-help-short = ⴰⴷⴳ
editor-tab-errors = ⵜⵉⵣⴳⴰⵍ
editor-tab-warnings = ⵉⵍⵖⴰ
editor-tab-info = ⵜⴰⵍⵖⵓⵜ
editor-tab-accessibility = ⴰⵏⴽⵛⵓⵎ
editor-tab-responses = ⵜⵉⵔⵉⵔⵉⵢⵉⵏ ⵢⵜⵜⵓⵣⵏⵏ

editor-tab-with-count = { $label }: { $count }

editor-options = ⵜⵉⵏⴼⵔⵓⵏⵉⵏ ⵏ ⵓⵎⴰⵥⵔⴰⴳ
editor-format-as-doenetml = ⵎⵙⵍ ⴰⵎ DoenetML
editor-format-as-xml = ⵎⵙⵍ ⴰⵎ XML


## The diagnostics panel

editor-diagnostic-line = ⵉⵣⵉⵔⵉⴳ #{ $line }

editor-no-errors = ⵓⵔ ⵍⵍⵉⵏⵜ ⵜⵉⵣⴳⴰⵍ
editor-no-warnings = ⵓⵔ ⵍⵍⵉⵏ ⵢⵉⵍⵖⴰ
editor-no-info = ⵓⵔ ⵜⵍⵍⵉ ⵜⵍⵖⵓⵜ

editor-show-info-annotations = ⵎⵍ ⵜⴰⵍⵖⵓⵜ ⴳ ⵓⵎⴰⵥⵔⴰⴳ
editor-show-accessibility-annotations = ⵎⵍ ⵉⵍⵖⴰ ⵏ ⵡⴰⵏⴽⵛⵓⵎ ⴳ ⵓⵎⴰⵥⵔⴰⴳ

editor-accessibility-learn-more = ⵍⵎⴷ ⵎⴰⵎⴽ ⵜⵜⵡⴰⵍⴰ Doenet ⴰⵏⴽⵛⵓⵎ

editor-accessibility-violations-heading = ⵉⵣⴳⴰⵔⵏ ⵏ ⵡⴰⵏⴽⵛⵓⵎ ({ $standard })

editor-accessibility-other-heading = ⵓⴳⵓⵔⵏ ⵢⴰⴹⵏⵉⵏ ⵏ ⵡⴰⵏⴽⵛⵓⵎ
editor-none-found = ⵓⵔ ⵢⵜⵜⵓⴼ ⵢⴰⵜ


## Submitted responses

editor-no-responses = ⵓⵔ ⵍⵍⵉⵏⵜ ⵜⵉⵔⵉⵔⵉⵢⵉⵏ ⵢⵜⵜⵓⵣⵏⵏ ⴰⵔ ⵖⵉⵍⴰⴷ
editor-response-answer-id = ⴰⵙⵓⵍⴰⵢ ⵏ ⵜⵔⵉⵔⵉⵜ
editor-response-response = ⵜⵉⵔⵉⵔⵉⵜ
editor-response-credit = ⵜⵉⵏⵇⵉⴹⵉⵏ
editor-response-submitted = ⵜⵜⵓⵣⵏ


## The context-help panel

help-placeholder = ⵔⴰⵔ ⵜⴰⵃⵏⴰⵛⵛⴰⴹ ⵅⴼ ⵢⵉⵙⵎ ⵏ ⵜⴱⵣⵉⵎⵜ, ⵅⴼ ⵓⵎⵙⵍⴰⵢ, ⵏⵖ ⵅⴼ { $ref } ⵉ ⵜⵙⵎⵍⵉⵜ.

help-unsupported-ref-chain = ⵜⴰⵍⵍⴰⵍⵜ ⵏ ⵜⵎⵖⵕⵉⵡⵉⵏ ⵙ ⵡⴰⵟⵟⴰⵙ ⵏ ⵢⵉⵃⵔⵉⵛⵏ ⴰⵎ { $example } ⴰⵔ ⵜⴰ ⵓⵔ ⵜⵍⵍⵉ.

help-unresolved-ref =
    { $reason ->
        [notFound] ⵓⵔ ⵢⵜⵜⵓⴼ ⵢⴰⵜ ⵉ ⵜⵎⵖⵕⵉⵜ ⴰⴷ: { $ref }.
        [multiple] ⵜⵜⵓⴼⵏ ⴰⵟⵟⴰⵙ ⵏ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵉ ⵜⵎⵖⵕⵉⵜ ⴰⴷ: { $ref }.
       *[indeterminate] ⵎⴰ ⵜⵎⵎⴰⵍ { $ref } ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵜⵜⵓⵙⵙⴰⵏ.
    }

help-learn-about-references = ⵍⵎⴷ ⵅⴼ ⵜⵎⵖⵕⵉⵡⵉⵏ →
help-reference-page = ⴰⵙⴰⵜⵓ ⵏ ⵜⵎⵖⵕⵉⵜ →

help-suggestions-header =
    { $location ->
        [inside] ⴳ { $element }
       *[top] ⴳ ⵓⵙⵡⵉⵔ ⴰⴼⵍⵍⴰⵢ
    }{ $allowed ->
        [none] { " — ⵓⵔ ⵉⵍⵍⵉ ⵎⴰ ⵔⴰⴷ ⵉⴷⴷⵓ ⴷⴰ." }
        [text] { " — ⴰⵔⵉ ⴰⴹⵔⵉⵙ ⴷⴰ." }
        [text-and-components] { " — ⴰⵔⵉ ⴰⴹⵔⵉⵙ ⴷⴰ, ⵏⵖ ⴰⵔⵎ:" }
       *[components] { " — ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵔⴰⴷ ⵜⴰⵔⵎⵜ:" }
    }

help-suggestions-footer = ⵙⵉⵜ { $shortcut } ⴰⴼⴰⴷ ⴰⴷ ⵜⵥⵕⵜ { $total } ⵏ ⵢⵉⴼⵔⴷⵉⵙⵏ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ⴷ ⵜⴰⵎⵖⵕⵉⵜ ⵖⵔ { $target }.
       *[other] { $ref } ⴷ ⵜⴰⵎⵖⵕⵉⵜ ⵖⵔ { $target } (ⵉⵣⵉⵔⵉⴳ { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] ⵜⵜⵓⵔⵏⴰ ⵙ { $owner } ⴰⵎ { $role }.
       *[other] ⵜⵜⵓⵔⵏⴰ ⵙ { $owner } ⴳ ⵢⵉⵣⵉⵔⵉⴳ { $line } ⴰⵎ { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ⴷ ⵜⴰⵎⵖⵕⵉⵜ ⵖⵔ ⵓⵎⵙⵍⴰⵢ { $property } ⵏ { $element }.
       *[other] { $ref } ⴷ ⵜⴰⵎⵖⵕⵉⵜ ⵖⵔ ⵓⵎⵙⵍⴰⵢ { $property } ⵏ { $element } (ⵉⵣⵉⵔⵉⴳ { $line }).
    }

help-kind-attribute = ⴰⵎⵙⵍⴰⵢ
help-kind-snippet = ⴰⴳⵣⵓⵎ
help-kind-array-entry = ⴰⵏⴽⵛⵓⵎ ⴳ ⵓⵎⵓⵖ

help-default = ⴰⵎⵣⵡⴰⵔⵓ:
help-active-default = ⴰⵎⵣⵡⴰⵔⵓ ⵓⵔⵎⵉⴷ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ⴰⵣⴰⵍⵏ ⵢⵜⵜⵓⵙⵉⵔⴳⵏ (ⵢⴰⵏ ⵉ ⴽⵓ ⵜⴰⵖⴰⵡⵙⴰ):
       *[other] ⴰⵣⴰⵍⵏ ⵢⵜⵜⵓⵙⵉⵔⴳⵏ:
    }

help-suggested-values = ⴰⵣⴰⵍⵏ ⵢⵜⵜⵓⵙⵓⵎⵔⵏ:

help-inserts = ⴰⵔ ⵉⵙⴽⵛⴰⵎ:

help-coordinates =
    { $count ->
        [one] ⵜⴰⵎⵙⵉⴷⴳⵜ:
        [few] ⵜⵉⵎⵙⵉⴷⴳⵉⵏ:
       *[other] ⵜⵉⵎⵙⵉⴷⴳⵉⵏ:
    }

help-type = ⴰⵏⴰⵡ:

help-resolved-style = ⴰⵖⴰⵏⵉⴱ ⵢⵜⵜⵓⴼⴰⵏ (styleNumber { $styleNumber }):

help-resolved-function-names = ⵉⵙⵎⴰⵡⵏ ⵏ ⵜⵡⵓⵔⵉⵡⵉⵏ ⵢⵜⵜⵓⴼⴰⵏ:
help-reset-list = ⴰⵎⵓⵖ ⵢⵜⵜⵓⵔⴰⵔⵏ ⴳ ⵓⵏⴽⵛⵓⵎ ⴰⴷ:
help-added-on-input = ⵎⴰ ⵢⵜⵜⵓⵔⵏⴰⵏ ⴳ ⵓⵏⴽⵛⵓⵎ ⴰⴷ:
help-removed-on-input = ⵎⴰ ⵢⵜⵜⵓⴽⴽⵙⵏ ⴳ ⵓⵏⴽⵛⵓⵎ ⴰⴷ:

help-reset-overrides = { $reset } ⵉⵣⵡⴰⵔ { $additional } ⴷ { $removed }.
