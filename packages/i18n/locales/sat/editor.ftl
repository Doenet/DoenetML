# Santali editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Written in Ol Chiki. Every counted message writes a `[two]` branch; see
# `content.ftl`'s header. `WCAG`, `WCAG AA`, `DoenetML`, `XML` and
# `styleNumber` are names rather than words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ᱫᱚᱦᱲᱟ ᱥᱟᱡᱟᱣ
       *[update] ᱱᱟᱶᱟ ᱛᱮᱭᱟᱨ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ᱩᱫᱩᱜᱤᱡ { $word }
       *[other] ᱩᱫᱩᱜᱤᱡ { $word } { $shortcut }
    }


## The variant picker

editor-variant = ᱨᱚᱠᱚᱢ

editor-variant-filter = ᱪᱷᱟᱸᱴᱟᱣ ᱢᱮ…

editor-variant-next = ᱛᱟᱭᱚᱢ ᱨᱚᱠᱚᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ

editor-variant-previous = ᱢᱟᱲᱟᱝ ᱨᱚᱠᱚᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ᱥᱩᱜᱚᱢ ᱨᱮᱱ ᱵᱷᱩᱞ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ। ᱥᱩᱜᱚᱢ ᱨᱤᱯᱚᱨᱴ { $action ->
            [close] ᱵᱚᱸᱫ
           *[open] ᱡᱷᱤᱡ
        } ᱞᱟᱹᱜᱤᱫ ᱠᱞᱤᱠ ᱢᱮ।
        [advisories] ᱥᱩᱜᱚᱢ ᱨᱤᱯᱚᱨᱴ { $action ->
            [close] ᱵᱚᱸᱫ
           *[open] ᱡᱷᱤᱡ
        } ᱞᱟᱹᱜᱤᱫ ᱠᱞᱤᱠ ᱢᱮ। ᱡᱟᱦᱟᱸ WCAG AA ᱵᱷᱩᱞ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱟᱨᱦᱚᱸ ᱥᱩᱜᱚᱢ ᱠᱟᱛᱷᱟ ᱢᱮᱱᱟᱜᱼᱟ।
       *[clean] ᱥᱩᱜᱚᱢ ᱨᱤᱯᱚᱨᱴ { $action ->
            [close] ᱵᱚᱸᱫ
           *[open] ᱡᱷᱤᱡ
        } ᱞᱟᱹᱜᱤᱫ ᱠᱞᱤᱠ ᱢᱮ। ᱡᱟᱦᱟᱸ ᱥᱩᱜᱚᱢ ᱨᱮᱱ ᱥᱟᱢᱥᱭᱟ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ᱥᱩᱜᱚᱢ ᱨᱮᱱ ᱵᱷᱩᱞ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ। { $count ->
            [one] { $count } WCAG AA ᱵᱷᱩᱞ
            [two] { $count } WCAG AA ᱵᱷᱩᱞᱠᱤᱱ
           *[other] { $count } WCAG AA ᱵᱷᱩᱞᱠᱚ
        } ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ। ᱥᱩᱜᱚᱢ ᱨᱤᱯᱚᱨᱴ { $action ->
            [close] ᱵᱚᱸᱫ
           *[open] ᱡᱷᱤᱡ
        } ᱞᱟᱹᱜᱤᱫ ᱠᱞᱤᱠ ᱢᱮ।
        [advisories] ᱡᱟᱦᱟᱸ WCAG AA ᱵᱷᱩᱞ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ। { $count ->
            [one] { $count } ᱟᱨᱦᱚᱸ ᱥᱩᱜᱚᱢ ᱠᱟᱛᱷᱟ
            [two] { $count } ᱟᱨᱦᱚᱸ ᱥᱩᱜᱚᱢ ᱠᱟᱛᱷᱟᱠᱤᱱ
           *[other] { $count } ᱟᱨᱦᱚᱸ ᱥᱩᱜᱚᱢ ᱠᱟᱛᱷᱟᱠᱚ
        } ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ। ᱥᱩᱜᱚᱢ ᱨᱤᱯᱚᱨᱴ { $action ->
            [close] ᱵᱚᱸᱫ
           *[open] ᱡᱷᱤᱡ
        } ᱞᱟᱹᱜᱤᱫ ᱠᱞᱤᱠ ᱢᱮ।
       *[clean] ᱡᱟᱦᱟᱸ WCAG AA ᱵᱷᱩᱞ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ। ᱥᱩᱜᱚᱢ ᱨᱤᱯᱚᱨᱴ { $action ->
            [close] ᱵᱚᱸᱫ
           *[open] ᱡᱷᱤᱡ
        } ᱞᱟᱹᱜᱤᱫ ᱠᱞᱤᱠ ᱢᱮ।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ᱵᱷᱟᱨᱥᱚᱱ { $version }

editor-tab-help = ᱡᱟᱭᱜᱟ ᱞᱮᱠᱟᱛᱮ ᱜᱚᱲᱚ
editor-tab-help-short = ᱡᱟᱭᱜᱟ
editor-tab-errors = ᱵᱷᱩᱞᱠᱚ
editor-tab-warnings = ᱦᱟᱸᱥᱤᱭᱟᱨᱠᱚ
editor-tab-info = ᱠᱟᱛᱷᱟ
editor-tab-accessibility = ᱥᱩᱜᱚᱢ
editor-tab-responses = ᱠᱩᱞ ᱦᱩᱭ ᱟᱠᱟᱱ ᱛᱮᱞᱟᱠᱚ

editor-tab-with-count = { $label }: { $count }

editor-options = ᱥᱟᱡᱟᱣᱤᱡ ᱨᱮᱱ ᱵᱟᱪᱷᱟᱣ
editor-format-as-doenetml = DoenetML ᱞᱮᱠᱟ ᱥᱟᱡᱟᱣ ᱢᱮ
editor-format-as-xml = XML ᱞᱮᱠᱟ ᱥᱟᱡᱟᱣ ᱢᱮ


## The diagnostics panel

editor-diagnostic-line = ᱥᱟᱨᱤ #{ $line }

editor-no-errors = ᱡᱟᱦᱟᱸ ᱵᱷᱩᱞ ᱵᱟᱹᱱᱩᱜᱼᱟ
editor-no-warnings = ᱡᱟᱦᱟᱸ ᱦᱟᱸᱥᱤᱭᱟᱨ ᱵᱟᱹᱱᱩᱜᱼᱟ
editor-no-info = ᱡᱟᱦᱟᱸ ᱠᱟᱛᱷᱟ ᱵᱟᱹᱱᱩᱜᱼᱟ

editor-show-info-annotations = ᱥᱟᱡᱟᱣᱤᱡ ᱨᱮ ᱠᱟᱛᱷᱟ ᱩᱫᱩᱜ ᱢᱮ
editor-show-accessibility-annotations = ᱥᱟᱡᱟᱣᱤᱡ ᱨᱮ ᱥᱩᱜᱚᱢ ᱠᱟᱛᱷᱟ ᱩᱫᱩᱜ ᱢᱮ

editor-accessibility-learn-more = Doenet ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱥᱩᱜᱚᱢ ᱧᱮᱞᱮᱫᱼᱟ ᱚᱱᱟ ᱵᱟᱰᱟᱭ ᱢᱮ

editor-accessibility-violations-heading = ᱥᱩᱜᱚᱢ ᱨᱮᱱ ᱵᱷᱩᱞᱠᱚ ({ $standard })

editor-accessibility-other-heading = ᱮᱴᱟᱜ ᱥᱩᱜᱚᱢ ᱥᱟᱢᱥᱭᱟᱠᱚ
editor-none-found = ᱡᱟᱦᱟᱸ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ


## Submitted responses

editor-no-responses = ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱡᱟᱦᱟᱸ ᱛᱮᱞᱟ ᱵᱟᱝ ᱠᱩᱞ ᱞᱮᱱᱟ
editor-response-answer-id = ᱛᱮᱞᱟ ᱟᱭᱰᱤ
editor-response-response = ᱛᱮᱞᱟ
editor-response-credit = ᱱᱚᱢᱵᱚᱨ
editor-response-submitted = ᱠᱩᱞ ᱦᱩᱭᱮᱱᱟ


## The context-help panel

help-placeholder = ᱫᱟᱞᱤᱞ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱨᱥᱚᱨ ᱫᱚ ᱴᱮᱜ ᱧᱩᱛᱩᱢ, ᱜᱩᱬ, ᱥᱮ { $ref } ᱨᱮ ᱫᱚᱦᱚ ᱢᱮ।

help-unsupported-ref-chain = { $example } ᱞᱮᱠᱟᱱ ᱟᱭᱢᱟ ᱦᱟᱹᱴᱤᱧ ᱛᱟᱞᱟᱨᱮᱱ ᱞᱟᱹᱜᱤᱫ ᱜᱚᱲᱚ ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱹᱱᱩᱜᱼᱟ।

help-unresolved-ref =
    { $reason ->
        [notFound] ᱱᱚᱶᱟ ᱛᱟᱞᱟ ᱨᱮᱱ ᱡᱟᱦᱟᱸ ᱞᱟᱠᱷᱟᱹᱭ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ: { $ref }।
        [multiple] ᱱᱚᱶᱟ ᱛᱟᱞᱟ ᱨᱮᱱ ᱟᱭᱢᱟ ᱞᱟᱠᱷᱟᱹᱭ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ: { $ref }।
       *[indeterminate] { $ref } ᱨᱮᱱ ᱞᱟᱠᱷᱟᱹᱭ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹ ᱦᱩᱭ ᱠᱮᱫᱼᱟ।
    }

help-learn-about-references = ᱛᱟᱞᱟ ᱵᱟᱵᱚᱛ ᱵᱟᱰᱟᱭ ᱢᱮ →
help-reference-page = ᱛᱟᱞᱟ ᱥᱟᱦᱴᱟ →

help-suggestions-header =
    { $location ->
        [inside] { $element } ᱵᱷᱤᱛᱨᱤ ᱨᱮ
       *[top] ᱥᱟᱱᱟᱢ ᱠᱷᱚᱱ ᱪᱮᱛᱟᱱ ᱛᱷᱟᱠ ᱨᱮ
    }{ $allowed ->
        [none] { " — ᱱᱚᱰᱮ ᱡᱟᱦᱟᱸ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।" }
        [text] { " — ᱱᱚᱰᱮ ᱚᱞ ᱢᱮ।" }
        [text-and-components] { " — ᱱᱚᱰᱮ ᱚᱞ ᱢᱮ, ᱥᱮ ᱱᱚᱶᱟᱠᱚ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱢᱮ:" }
       *[components] { " — ᱱᱚᱶᱟᱠᱚ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱢᱮ:" }
    }

help-suggestions-footer = ᱥᱟᱱᱟᱢ { $total } ᱦᱟᱹᱴᱤᱧ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ { $shortcut } ᱚᱛᱟ ᱢᱮ।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ᱫᱚ { $target } ᱨᱮᱱ ᱢᱤᱫ ᱛᱟᱞᱟ ᱠᱟᱱᱟ।
       *[other] { $ref } ᱫᱚ { $target } ᱨᱮᱱ ᱢᱤᱫ ᱛᱟᱞᱟ ᱠᱟᱱᱟ (ᱥᱟᱨᱤ { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ᱫᱟᱨᱟᱭ ᱛᱮ { $role } ᱞᱮᱠᱟᱛᱮ ᱟᱜᱩ ᱦᱩᱭᱮᱱᱟ।
       *[other] { $owner } ᱫᱟᱨᱟᱭ ᱛᱮ ᱥᱟᱨᱤ { $line } ᱨᱮ { $role } ᱞᱮᱠᱟᱛᱮ ᱟᱜᱩ ᱦᱩᱭᱮᱱᱟ।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ᱫᱚ { $element } ᱨᱮᱱ { $property } ᱜᱩᱬ ᱨᱮᱱ ᱢᱤᱫ ᱛᱟᱞᱟ ᱠᱟᱱᱟ।
       *[other] { $ref } ᱫᱚ { $element } ᱨᱮᱱ { $property } ᱜᱩᱬ ᱨᱮᱱ ᱢᱤᱫ ᱛᱟᱞᱟ ᱠᱟᱱᱟ (ᱥᱟᱨᱤ { $line })।
    }

help-kind-attribute = ᱜᱩᱬ
help-kind-snippet = ᱴᱩᱠᱩᱲ
help-kind-array-entry = ᱥᱟᱨᱬᱤ ᱵᱚᱞᱚᱱ

help-default = ᱢᱩᱞ:
help-active-default = ᱠᱟᱹᱢᱤᱭᱟᱜ ᱢᱩᱞ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ᱦᱩᱭᱩᱜ ᱠᱟᱱ ᱜᱚᱱᱚᱝ (ᱢᱤᱫ ᱢᱤᱫ ᱡᱤᱱᱤᱥ ᱞᱟᱹᱜᱤᱫ ᱢᱤᱫ):
       *[other] ᱦᱩᱭᱩᱜ ᱠᱟᱱ ᱜᱚᱱᱚᱝ:
    }

help-suggested-values = ᱠᱟᱛᱷᱟ ᱮᱢ ᱟᱠᱟᱱ ᱜᱚᱱᱚᱝ:

help-inserts = ᱵᱚᱞᱚ ᱮᱪᱚᱜᱼᱟ:

help-coordinates =
    { $count ->
        [one] ᱱᱤᱨᱫᱮᱥᱟᱝᱠᱚ:
        [two] ᱱᱤᱨᱫᱮᱥᱟᱝᱠᱚᱠᱤᱱ:
       *[other] ᱱᱤᱨᱫᱮᱥᱟᱝᱠᱚᱠᱚ:
    }

help-type = ᱨᱚᱠᱚᱢ:

help-resolved-style = ᱴᱷᱟᱹᱣᱠᱟᱹ ᱟᱠᱟᱱ ᱥᱟᱡᱟᱣ (styleNumber { $styleNumber }):

help-resolved-function-names = ᱴᱷᱟᱹᱣᱠᱟᱹ ᱟᱠᱟᱱ ᱯᱷᱚᱞᱚᱱ ᱧᱩᱛᱩᱢ:
help-reset-list = ᱱᱚᱶᱟ ᱵᱚᱞᱚᱱ ᱨᱮ ᱫᱚᱦᱲᱟ ᱥᱟᱡᱟᱣ ᱞᱤᱥᱴᱤ:
help-added-on-input = ᱱᱚᱶᱟ ᱵᱚᱞᱚᱱ ᱨᱮ ᱥᱮᱞᱮᱫ ᱦᱩᱭᱮᱱᱟ:
help-removed-on-input = ᱱᱚᱶᱟ ᱵᱚᱞᱚᱱ ᱨᱮ ᱚᱪᱚᱜ ᱦᱩᱭᱮᱱᱟ:

help-reset-overrides = { $reset } ᱫᱚ { $additional } ᱟᱨ { $removed } ᱪᱮᱛᱟᱱ ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ।
