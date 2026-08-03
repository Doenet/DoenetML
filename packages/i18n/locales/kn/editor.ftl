# Kannada editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ಮರುಹೊಂದಿಸು
       *[update] ನವೀಕರಿಸು
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ವೀಕ್ಷಕವನ್ನು { $word }
       *[other] ವೀಕ್ಷಕವನ್ನು { $word } { $shortcut }
    }


## The variant picker

editor-variant = ಪ್ರಭೇದ
editor-variant-filter = ಸೋಸು...
editor-variant-next = ಮುಂದಿನ ಪ್ರಭೇದವನ್ನು ಆರಿಸು
editor-variant-previous = ಹಿಂದಿನ ಪ್ರಭೇದವನ್ನು ಆರಿಸು


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ಪ್ರವೇಶಸಾಧ್ಯತೆ ಉಲ್ಲಂಘನೆ ಕಂಡುಬಂದಿದೆ. ಪ್ರವೇಶಸಾಧ್ಯತೆ ವರದಿಯನ್ನು { $action ->
            [close] ಮುಚ್ಚಲು
           *[open] ತೆರೆಯಲು
        } ಕ್ಲಿಕ್ ಮಾಡಿ.
        [advisories] ಪ್ರವೇಶಸಾಧ್ಯತೆ ವರದಿಯನ್ನು { $action ->
            [close] ಮುಚ್ಚಲು
           *[open] ತೆರೆಯಲು
        } ಕ್ಲಿಕ್ ಮಾಡಿ. WCAG AA ಉಲ್ಲಂಘನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ, ಆದರೆ ಹೆಚ್ಚುವರಿ ಪ್ರವೇಶಸಾಧ್ಯತೆ ಶಿಫಾರಸುಗಳಿವೆ.
       *[clean] ಪ್ರವೇಶಸಾಧ್ಯತೆ ವರದಿಯನ್ನು { $action ->
            [close] ಮುಚ್ಚಲು
           *[open] ತೆರೆಯಲು
        } ಕ್ಲಿಕ್ ಮಾಡಿ. ಯಾವುದೇ ಪ್ರವೇಶಸಾಧ್ಯತೆ ಸಮಸ್ಯೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ಪ್ರವೇಶಸಾಧ್ಯತೆ ಉಲ್ಲಂಘನೆ ಕಂಡುಬಂದಿದೆ. { $count ->
            [one] { $count } WCAG AA ಉಲ್ಲಂಘನೆ
           *[other] { $count } WCAG AA ಉಲ್ಲಂಘನೆಗಳು
        } ಕಂಡುಬಂದಿವೆ. ಪ್ರವೇಶಸಾಧ್ಯತೆ ವರದಿಯನ್ನು { $action ->
            [close] ಮುಚ್ಚಲು
           *[open] ತೆರೆಯಲು
        } ಕ್ಲಿಕ್ ಮಾಡಿ.
        [advisories] WCAG AA ಉಲ್ಲಂಘನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. { $count ->
            [one] { $count } ಹೆಚ್ಚುವರಿ ಪ್ರವೇಶಸಾಧ್ಯತೆ ಶಿಫಾರಸು
           *[other] { $count } ಹೆಚ್ಚುವರಿ ಪ್ರವೇಶಸಾಧ್ಯತೆ ಶಿಫಾರಸುಗಳು
        } ಕಂಡುಬಂದಿವೆ. ಪ್ರವೇಶಸಾಧ್ಯತೆ ವರದಿಯನ್ನು { $action ->
            [close] ಮುಚ್ಚಲು
           *[open] ತೆರೆಯಲು
        } ಕ್ಲಿಕ್ ಮಾಡಿ.
       *[clean] WCAG AA ಉಲ್ಲಂಘನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಪ್ರವೇಶಸಾಧ್ಯತೆ ವರದಿಯನ್ನು { $action ->
            [close] ಮುಚ್ಚಲು
           *[open] ತೆರೆಯಲು
        } ಕ್ಲಿಕ್ ಮಾಡಿ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ಆವೃತ್ತಿ { $version }

editor-tab-help = ಸಂದರ್ಭೋಚಿತ ಸಹಾಯ
editor-tab-help-short = ಸಂದರ್ಭ
editor-tab-errors = ದೋಷಗಳು
editor-tab-warnings = ಎಚ್ಚರಿಕೆಗಳು
editor-tab-info = ಮಾಹಿತಿ
editor-tab-accessibility = ಪ್ರವೇಶಸಾಧ್ಯತೆ
editor-tab-responses = ಸಲ್ಲಿಸಿದ ಉತ್ತರಗಳು

editor-tab-with-count = { $label }: { $count }

editor-options = ಸಂಪಾದಕ ಆಯ್ಕೆಗಳು
editor-format-as-doenetml = DoenetML ಆಗಿ ಜೋಡಿಸು
editor-format-as-xml = XML ಆಗಿ ಜೋಡಿಸು


## The diagnostics panel

editor-diagnostic-line = ಸಾಲು #{ $line }

editor-no-errors = ದೋಷಗಳಿಲ್ಲ
editor-no-warnings = ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ
editor-no-info = ಮಾಹಿತಿ ಸೂಚನೆಗಳಿಲ್ಲ

editor-show-info-annotations = ಸಂಪಾದಕದಲ್ಲಿ ಮಾಹಿತಿ ಸೂಚನೆಗಳನ್ನು ತೋರಿಸು
editor-show-accessibility-annotations = ಸಂಪಾದಕದಲ್ಲಿ ಪ್ರವೇಶಸಾಧ್ಯತೆ ಸೂಚನೆಗಳನ್ನು ತೋರಿಸು

editor-accessibility-learn-more = ಪ್ರವೇಶಸಾಧ್ಯತೆಯ ಬಗ್ಗೆ Doenet ನ ನಿಲುವನ್ನು ತಿಳಿಯಿರಿ

editor-accessibility-violations-heading = ಪ್ರವೇಶಸಾಧ್ಯತೆ ಉಲ್ಲಂಘನೆಗಳು ({ $standard })

editor-accessibility-other-heading = ಇತರ ಪ್ರವೇಶಸಾಧ್ಯತೆ ಸಮಸ್ಯೆಗಳು
editor-none-found = ಯಾವುದೂ ಕಂಡುಬಂದಿಲ್ಲ


## Submitted responses

editor-no-responses = ಇನ್ನೂ ಯಾವುದೇ ಉತ್ತರ ಸಲ್ಲಿಕೆಯಾಗಿಲ್ಲ
editor-response-answer-id = ಉತ್ತರ Id
editor-response-response = ಉತ್ತರ
editor-response-credit = ಅಂಕ
editor-response-submitted = ಸಲ್ಲಿಸಲಾಗಿದೆ


## The context-help panel

help-placeholder = ದಸ್ತಾವೇಜನ್ನು ನೋಡಲು ಟ್ಯಾಗ್ ಹೆಸರು, ಗುಣ ಅಥವಾ { $ref } ಮೇಲೆ ತೆರೆಸೂಚಿಯನ್ನು ಇರಿಸಿ.

help-unsupported-ref-chain = { $example } ನಂತಹ ಬಹುಭಾಗದ ಉಲ್ಲೇಖಗಳಿಗೆ ಸಹಾಯ ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ.

help-unresolved-ref =
    { $reason ->
        [notFound] ಈ ಉಲ್ಲೇಖಕ್ಕೆ ಯಾವುದೂ ಕಂಡುಬಂದಿಲ್ಲ: { $ref }.
        [multiple] ಈ ಉಲ್ಲೇಖಕ್ಕೆ ಹಲವು ಗುರಿಗಳು ಕಂಡುಬಂದಿವೆ: { $ref }.
       *[indeterminate] { $ref } ಗೆ ಗುರಿಯನ್ನು ನಿರ್ಧರಿಸಲಾಗಲಿಲ್ಲ.
    }

help-learn-about-references = ಉಲ್ಲೇಖಗಳ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ →
help-reference-page = ಆಕರ ಪುಟ →

help-suggestions-header =
    { $location ->
        [inside] { $element } ಒಳಗೆ
       *[top] ಮೇಲಿನ ಹಂತದಲ್ಲಿ
    }{ $allowed ->
        [none] { " — ಇಲ್ಲಿ ಏನೂ ಬರುವುದಿಲ್ಲ." }
        [text] { " — ಇಲ್ಲಿ ಪಠ್ಯ ಬರೆಯಬಹುದು." }
        [text-and-components] { " — ಇಲ್ಲಿ ಪಠ್ಯ ಬರೆಯಬಹುದು, ಅಥವಾ ಇವನ್ನು ಪ್ರಯತ್ನಿಸಿ:" }
       *[components] { " — ಇವನ್ನು ಪ್ರಯತ್ನಿಸಿ:" }
    }

help-suggestions-footer = ಎಲ್ಲಾ { $total } ಘಟಕಗಳನ್ನು ನೋಡಲು { $shortcut } ಒತ್ತಿ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ಎಂಬುದು { $target } ಗೆ ಉಲ್ಲೇಖ.
       *[other] { $ref } ಎಂಬುದು { $target } ಗೆ ಉಲ್ಲೇಖ ({ $line } ನೇ ಸಾಲು).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ಇದನ್ನು { $role } ಆಗಿ ಪರಿಚಯಿಸಿದೆ.
       *[other] { $owner } ಇದನ್ನು { $line } ನೇ ಸಾಲಿನಲ್ಲಿ { $role } ಆಗಿ ಪರಿಚಯಿಸಿದೆ.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ಎಂಬುದು { $element } ನ { $property } ಗುಣಕ್ಕೆ ಉಲ್ಲೇಖ.
       *[other] { $ref } ಎಂಬುದು { $element } ನ { $property } ಗುಣಕ್ಕೆ ಉಲ್ಲೇಖ ({ $line } ನೇ ಸಾಲು).
    }

help-kind-attribute = ಗುಣ
help-kind-snippet = ತುಣುಕು
help-kind-array-entry = ಸರಣಿ ನಮೂದು

help-default = ಪೂರ್ವನಿಯೋಜಿತ:
help-active-default = ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಪೂರ್ವನಿಯೋಜಿತ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ಅನುಮತಿಸಿದ ಮೌಲ್ಯಗಳು (ಪ್ರತಿ ನಮೂದಿಗೆ ಒಂದು):
       *[other] ಅನುಮತಿಸಿದ ಮೌಲ್ಯಗಳು:
    }

help-suggested-values = ಸೂಚಿಸಿದ ಮೌಲ್ಯಗಳು:

help-inserts = ಸೇರಿಸುವುದು:

help-coordinates =
    { $count ->
        [one] ನಿರ್ದೇಶಾಂಕ:
       *[other] ನಿರ್ದೇಶಾಂಕಗಳು:
    }

help-type = ಬಗೆ:

help-resolved-style = ನಿರ್ಧರಿತ ಶೈಲಿ (styleNumber { $styleNumber }):

help-resolved-function-names = ನಿರ್ಧರಿತ ಉತ್ಪನ್ನ ಹೆಸರುಗಳು:
help-reset-list = ಈ ಆದಾನದಲ್ಲಿ ಮರುಹೊಂದಿಸುವ ಪಟ್ಟಿ:
help-added-on-input = ಈ ಆದಾನದಲ್ಲಿ ಸೇರಿಸಿದವು:
help-removed-on-input = ಈ ಆದಾನದಲ್ಲಿ ತೆಗೆದವು:

help-reset-overrides = { $reset } ಎಂಬುದು { $additional } ಮತ್ತು { $removed } ಅನ್ನು ಮೀರಿಸುತ್ತದೆ.
