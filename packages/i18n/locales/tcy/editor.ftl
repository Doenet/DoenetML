# Tulu (ತುಳು) editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and register** are `chrome.ftl`'s: Kannada rather than Tigalari,
# and a Kannada technical vocabulary declared as a loan register around a Tulu
# frame — ಇಜ್ಜಿ, ಉಂಡು, ಆಪುಜಿ, ತಿಕ್ಕುಜಿ, ಆವೊಡು, ಬೊಕ್ಕ, ಅತ್ತ್ಂಡ, ಒಟ್ಟುಗು, and
# the honorific imperative in -ಲೆ.
#
# **`WCAG`, `DoenetML`, `styleNumber` and every element and attribute name
# stay in English.** They are identifiers an author types, not words. So does
# `$shortcut`, which is a key combination, and `$version`, `$standard` and
# `$ref`.
#
# **The counts do not fork.** `editor-accessibility-label` and
# `help-coordinates` write a single `*[other]` where English writes `[one]`
# and `[other]`: CLDR has no plural data for `tcy`, so an English-selected
# branch here would be a category this locale cannot reach. A Tulu noun is
# unmarked for number after a numeral in any case, so the single form is also
# the grammatical one.
#
# **The arrow `→` in the two link labels is direction rather than
# punctuation** and is left where English puts it: the Kannada script is
# written left to right.
#
# **Numbers render in Latin digits** rather than in Kannada numerals (#1615).


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ಪಿರ ದೀಲೆ
       *[update] ನವೀಕರಣ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ವೀಕ್ಷಕ { $word }
       *[other] ವೀಕ್ಷಕ { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = ಸೋಸುನ...
editor-variant-next = ಬೊಕ್ಕದ variant ಆಯ್ಕೆ ಮಲ್ಪುಲೆ
editor-variant-previous = ದುಂಬುದ variant ಆಯ್ಕೆ ಮಲ್ಪುಲೆ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ಸೌಲಭ್ಯ ಉಲ್ಲಂಘನೆ ತಿಕ್ಕ್‌ಂಡ್. ಸೌಲಭ್ಯದ ವರದಿನ್ { $action ->
            [close] ಮುಚ್ಚೆರೆ
           *[open] ದೆಪ್ಪೆರೆ
        } ಕ್ಲಿಕ್ ಮಲ್ಪುಲೆ.
        [advisories] ಸೌಲಭ್ಯದ ವರದಿನ್ { $action ->
            [close] ಮುಚ್ಚೆರೆ
           *[open] ದೆಪ್ಪೆರೆ
        } ಕ್ಲಿಕ್ ಮಲ್ಪುಲೆ. ಒವ್ವೇ WCAG AA ಉಲ್ಲಂಘನೆ ತಿಕ್ಕುಜಿ, ಆಂಡ ಬೇತೆ ಕೆಲವು ಸೌಲಭ್ಯದ ಸಲಹೆಲು ಉಂಡು.
       *[clean] ಸೌಲಭ್ಯದ ವರದಿನ್ { $action ->
            [close] ಮುಚ್ಚೆರೆ
           *[open] ದೆಪ್ಪೆರೆ
        } ಕ್ಲಿಕ್ ಮಲ್ಪುಲೆ. ಒವ್ವೇ ಸೌಲಭ್ಯದ ಸಮಸ್ಯೆ ತಿಕ್ಕುಜಿ.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ಸೌಲಭ್ಯ ಉಲ್ಲಂಘನೆ ತಿಕ್ಕ್‌ಂಡ್. { $count ->
           *[other] { $count } WCAG AA ಉಲ್ಲಂಘನೆ
        } ತಿಕ್ಕ್‌ಂಡ್. ಸೌಲಭ್ಯದ ವರದಿನ್ { $action ->
            [close] ಮುಚ್ಚೆರೆ
           *[open] ದೆಪ್ಪೆರೆ
        } ಕ್ಲಿಕ್ ಮಲ್ಪುಲೆ.
        [advisories] ಒವ್ವೇ WCAG AA ಉಲ್ಲಂಘನೆ ತಿಕ್ಕುಜಿ. { $count ->
           *[other] { $count } ಬೇತೆ ಸೌಲಭ್ಯದ ಸಲಹೆ
        } ತಿಕ್ಕ್‌ಂಡ್. ಸೌಲಭ್ಯದ ವರದಿನ್ { $action ->
            [close] ಮುಚ್ಚೆರೆ
           *[open] ದೆಪ್ಪೆರೆ
        } ಕ್ಲಿಕ್ ಮಲ್ಪುಲೆ.
       *[clean] ಒವ್ವೇ WCAG AA ಉಲ್ಲಂಘನೆ ತಿಕ್ಕುಜಿ. ಸೌಲಭ್ಯದ ವರದಿನ್ { $action ->
            [close] ಮುಚ್ಚೆರೆ
           *[open] ದೆಪ್ಪೆರೆ
        } ಕ್ಲಿಕ್ ಮಲ್ಪುಲೆ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ಆವೃತ್ತಿ { $version }

editor-tab-help = ಸಂದರ್ಭೊಗು ತಕ್ಕ ಸಹಾಯ
editor-tab-help-short = ಸಂದರ್ಭ
editor-tab-errors = ದೋಷೊಲು
editor-tab-warnings = ಎಚ್ಚರಿಕೆಲು
editor-tab-info = ವಿವರ
editor-tab-accessibility = ಸೌಲಭ್ಯ
editor-tab-responses = ಕಡಪುಡಿನ ಉತ್ತರೊಲು

editor-tab-with-count = { $label }: { $count }

editor-options = ಸಂಪಾದಕದ ಆಯ್ಕೆಲು
editor-format-as-doenetml = DoenetML ಆದ್ ಜೋಡಿಪುಲೆ
editor-format-as-xml = XML ಆದ್ ಜೋಡಿಪುಲೆ


## The diagnostics panel

editor-diagnostic-line = ಸಾಲು #{ $line }

editor-no-errors = ಒವ್ವೇ ದೋಷ ಇಜ್ಜಿ
editor-no-warnings = ಒವ್ವೇ ಎಚ್ಚರಿಕೆ ಇಜ್ಜಿ
editor-no-info = ಒವ್ವೇ ವಿವರದ ಸೂಚನೆ ಇಜ್ಜಿ

editor-show-info-annotations = ಸಂಪಾದಕೊಡು ವಿವರದ ಸೂಚನೆಲೆನ್ ತೋಜಾಲೆ
editor-show-accessibility-annotations = ಸಂಪಾದಕೊಡು ಸೌಲಭ್ಯದ ಸೂಚನೆಲೆನ್ ತೋಜಾಲೆ

editor-accessibility-learn-more = Doenet ಸೌಲಭ್ಯೊನು ಏತ್ ಲೆಕ್ಕ ತೂಪುಂಡು ಪಂಡ್‌ದ್ ಕಲ್ಪುಲೆ

editor-accessibility-violations-heading = ಸೌಲಭ್ಯ ಉಲ್ಲಂಘನೆಲು ({ $standard })

editor-accessibility-other-heading = ಬೇತೆ ಸೌಲಭ್ಯದ ಸಮಸ್ಯೆಲು
editor-none-found = ಒವ್ವೂ ತಿಕ್ಕುಜಿ


## Submitted responses

editor-no-responses = ಇನಿ ಮುಟ್ಟ ಒವ್ವೇ ಉತ್ತರ ಕಡಪುಡ್‌ದಿಜ್ಜಿ
editor-response-answer-id = Answer Id
editor-response-response = ಉತ್ತರ
editor-response-credit = ಅಂಕ
editor-response-submitted = ಕಡಪುಡ್‌ದ್ಂಡ್


## The context-help panel

help-placeholder = ದಾಖಲೆಗ್ ಕರ್ಸರ್‌ನ್ ಒಂಜಿ ಟ್ಯಾಗ್‌ದ ಪುದರ್, ಗುಣ ಅತ್ತ್ಂಡ { $ref }ದ ಮಿತ್ತ್ ದೀಲೆ.

help-unsupported-ref-chain = { $example }ದ ಲೆಕ್ಕದ ಮಸ್ತ್ ಭಾಗೊಲೆ ಉಲ್ಲೇಖೊಗು ಸಹಾಯ ಇನಿ ಮುಟ್ಟ ನಡೆಪುಜಿ.

help-unresolved-ref =
    { $reason ->
        [notFound] ಉಲ್ಲೇಖೊಗು ಒವ್ವೇ ಗುರಿ ತಿಕ್ಕುಜಿ: { $ref }.
        [multiple] ಉಲ್ಲೇಖೊಗು ಒಂಜಿಡ್ದ್ ಜಾಸ್ತಿ ಗುರಿ ತಿಕ್ಕ್‌ಂಡ್: { $ref }.
       *[indeterminate] { $ref }ದ ಗುರಿನ್ ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆತಿಜ್ಜಿ.
    }

help-learn-about-references = ಉಲ್ಲೇಖೊಲೆ ಬಗೆಟ್ ಕಲ್ಪುಲೆ →
help-reference-page = ಉಲ್ಲೇಖೊದ ಪುಟ →

help-suggestions-header =
    { $location ->
        [inside] { $element }ದ ಒಳಯಿ
       *[top] ಮಿತ್ತ್‌ದ ಹಂತೊಡು
    }{ $allowed ->
        [none] { " — ಇಂಚಿ ಒವ್ವೂ ಬರ್ಪುಜಿ." }
        [text] { " — ಇಂಚಿ ಬರವು ಬರೆಪುಲೆ." }
        [text-and-components] { " — ಇಂಚಿ ಬರವು ಬರೆಪುಲೆ, ಅತ್ತ್ಂಡ ಇಂದೆನ್ ತೂಲೆ:" }
       *[components] { " — ತೂವೊಲಿನವು:" }
    }

help-suggestions-footer = ಮಾತ { $total } ಘಟಕೊಲೆನ್ ತೂಯೆರೆ { $shortcut } ಒತ್ತುಲೆ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ಪಂಡ { $target }ದ ಒಂಜಿ ಉಲ್ಲೇಖ.
       *[other] { $ref } ಪಂಡ { $target }ದ ಒಂಜಿ ಉಲ್ಲೇಖ (ಸಾಲು { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ಅವೆನ್ { $role } ಆದ್ ಕನತ್‌ದ್ಂಡ್.
       *[other] { $owner } ಅವೆನ್ ಸಾಲು { $line }ಡ್ { $role } ಆದ್ ಕನತ್‌ದ್ಂಡ್.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ಪಂಡ { $element }ದ { $property } ಗುಣೊದ ಒಂಜಿ ಉಲ್ಲೇಖ.
       *[other] { $ref } ಪಂಡ { $element }ದ { $property } ಗುಣೊದ ಒಂಜಿ ಉಲ್ಲೇಖ (ಸಾಲು { $line }).
    }

help-kind-attribute = ಗುಣ
help-kind-snippet = ತುಂಡು
help-kind-array-entry = ಸರಣಿದ ನಮೂದು

help-default = ದುಂಬೇ ಗೊತ್ತು ಮಲ್ತಿನವು:
help-active-default = ಇತ್ತೆದ ದುಂಬೇ ಗೊತ್ತು ಮಲ್ತಿನವು:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ನಡೆಪುನ ಮೌಲ್ಯೊಲು (ಪ್ರತಿ ವಸ್ತುಗು ಒಂಜಿ):
       *[other] ನಡೆಪುನ ಮೌಲ್ಯೊಲು:
    }

help-suggested-values = ಸಲಹೆ ಕೊರ್ತಿನ ಮೌಲ್ಯೊಲು:

help-inserts = ಸೇರಾವುಂಡು:

help-coordinates =
    { $count ->
       *[other] ನಿರ್ದೇಶಾಂಕ:
    }

help-type = ತರ:

help-resolved-style = ಗೊತ್ತಾಯಿನ ಶೈಲಿ (styleNumber { $styleNumber }):

help-resolved-function-names = ಗೊತ್ತಾಯಿನ ಉತ್ಪನ್ನೊದ ಪುದರುಲು:
help-reset-list = ಈ input‌ದ ಪಿರ ದೀಪುನ ಪಟ್ಟಿ:
help-added-on-input = ಈ input‌ಡ್ ಸೇರಾಯಿನವು:
help-removed-on-input = ಈ input‌ಡ್ ದೆತ್ತಿನವು:

help-reset-overrides = { $reset } { $additional } ಬೊಕ್ಕ { $removed }ದ ಮಿತ್ತ್ ನಡೆಪುಂಡು.
