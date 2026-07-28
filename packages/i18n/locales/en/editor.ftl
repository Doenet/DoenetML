# Editor and language-server surfaces: the footer, the diagnostics panel, the
# variant picker and the accessibility button. Selected by `uiLocale`.
#
# The editor binds to *one* language, and it is the one the viewer below it
# resolved rather than the one the surrounding host chrome uses: the panel
# lists diagnostics rendered down there, where an authored `<document lang>` is
# known, and a footer in one language above a panel in another reads worse than
# either choice on its own (#1580).
#
# The LSP ships bundled with its DoenetML version, so these catalogs are
# version-correct rather than always-latest.
#
# Message ids are lower-kebab-case Fluent identifiers, optionally with a
# single `.attribute` suffix (`format-document`).


## The viewer's controls
##
## `editor-update-viewer` names the button that recompiles the document. Its
## word depends on whether the source changed or only the document's state
## did, which is a distinction the code makes and a `$action` says: the button
## is otherwise identical, and splitting it into two messages would let the two
## drift.
##
## The keyboard hint is a separate branch rather than text appended after the
## title, because where a shortcut sits in a sentence is not the same in every
## language. `$shortcut` is a key combination and stays as written.
##
## The tooltip takes the word as `$word` rather than referencing the message
## above it: a message reference resolves only inside its own bundle, so a
## locale that translated the tooltip but not the word would render the
## reference literally instead of falling back to English. This is the shape
## `paginator-page-status` already uses.

editor-update-viewer =
    { $action ->
        [reset] Reset
       *[update] Update
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Viewer
       *[other] { $word } Viewer { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filter...
editor-variant-next = Select next variant
editor-variant-previous = Select previous variant


## The accessibility status button
##
## `WCAG AA` is the name of the standard and is not translated, the way
## `accessibility-heading-level-1` already leaves it.
##
## The tooltip and the label are separate messages rather than one with an
## extra clause: the label counts the violations and the tooltip does not, and
## a screen reader and a hover are different audiences.
##
## `$action` is whether clicking opens or closes the report — an interpolated
## English verb before this, which no locale could reach and which no language
## has to place where English does.

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA accessibility violation identified. Click to { $action ->
            [close] close
           *[open] open
        } accessibility report.
        [advisories] Click to { $action ->
            [close] close
           *[open] open
        } accessibility report. No WCAG AA violations were found, but additional accessibility recommendations are available.
       *[clean] Click to { $action ->
            [close] close
           *[open] open
        } accessibility report. No accessibility issues were found.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA accessibility violation identified. { $count ->
            [one] { $count } WCAG AA violation
           *[other] { $count } WCAG AA violations
        } found. Click to { $action ->
            [close] close
           *[open] open
        } accessibility report.
        [advisories] No WCAG AA violations identified. { $count ->
            [one] { $count } additional accessibility recommendation
           *[other] { $count } additional accessibility recommendations
        } found. Click to { $action ->
            [close] close
           *[open] open
        } accessibility report.
       *[clean] No WCAG AA violations identified. Click to { $action ->
            [close] close
           *[open] open
        } accessibility report.
    }

# The word on the button itself, beside the icon, when there are violations.
editor-accessibility-badge = WCAG


## The footer
##
## `$version` is a version number and stays as written.

editor-version-title = DoenetML version { $version }

editor-tab-help = Context-sensitive help
# The word beside the icon on that tab, which has room for one word.
editor-tab-help-short = Context
editor-tab-errors = Errors
editor-tab-warnings = Warnings
editor-tab-info = Info
editor-tab-accessibility = Accessibility
editor-tab-responses = Submitted responses

# A tab's accessible name when it carries a count: "Errors: 3".
editor-tab-with-count = { $label }: { $count }

editor-options = Editor options
editor-format-as-doenetml = Format as DoenetML
editor-format-as-xml = Format as XML


## The diagnostics panel

# Where in the source a diagnostic was found. `$line` arrives as text, not as a
# number: it identifies the line, so line 1234 is "#1234" and not "#1,234".
editor-diagnostic-line = Line #{ $line }

editor-no-errors = No Errors
editor-no-warnings = No Warnings
editor-no-info = No Info Diagnostics

editor-show-info-annotations = Show info diagnostics in editor
editor-show-accessibility-annotations = Show accessibility diagnostics in editor

# Links into the documentation, which has no translated pages yet. The words
# move; where they point does not (#1580).
editor-accessibility-learn-more = Learn how Doenet approaches accessibility

# The heading over the WCAG AA failures. The standard's name is a link, so it
# arrives as an argument rather than being written into the sentence — the
# brackets around it are this catalog's punctuation, and the link is the code's.
editor-accessibility-violations-heading = Accessibility violations ({ $standard })

editor-accessibility-other-heading = Other accessibility issues
editor-none-found = None found


## Submitted responses

editor-no-responses = No submitted responses yet
editor-response-answer-id = Answer Id
editor-response-response = Response
editor-response-credit = Credit
editor-response-submitted = Submitted
