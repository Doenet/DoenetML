# Editor and language-server surfaces: the footer, the diagnostics panel, the
# variant picker, the accessibility button, and the context-help panel beside
# them. Selected by `uiLocale`.
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

# Button label. "Update" recompiles after a source edit; "Reset" reverts
# only the document's live state to match — same button, different verb.
# Keep both forms short enough to fit a toolbar button.
editor-update-viewer =
    { $action ->
        [reset] Reset
       *[update] Update
    }

# Tooltip on the button above. { $word } is that button's own current label
# ("Update" or "Reset"), so this reads as e.g. "Update Viewer" or
# "Reset Viewer". { $shortcut } appends the keyboard shortcut when one exists.
editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Viewer
       *[other] { $word } Viewer { $shortcut }
    }


## The variant picker

# Label for the variant picker control itself (a noun, like a field label).
editor-variant = Variant

# Placeholder text shown in the empty filter input, before the user types
# anything — not a button or instruction.
editor-variant-filter = Filter...

# Button/action label: advances to the next variant in the list.
editor-variant-next = Select next variant

# Button/action label: goes back to the previous variant in the list.
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


## The context-help panel
##
## The panel beside the diagnostics, which explains whatever the cursor is on.
## It is the last of the surfaces the header above names.
##
## Several of these sentences have marked-up fragments in them — an element
## name in `<code>`, a link, a rendered piece of inline markdown. Those arrive
## as arguments and are put back as React nodes after the message is formatted,
## so a translation owns the whole sentence including where each fragment sits
## and the punctuation around it. A translation that drops one simply renders
## without it rather than losing the sentence.
##
## Element names, attribute names and `styleNumber` are DoenetML identifiers
## and stay as written. The descriptions and summaries the panel shows come
## from the schema, which is generated from the documentation and is not
## translated, and the values it resolves — a color's derived word, a
## function name, a type — come from the language server in the same state.
## What is here is the panel's own prose around them (#1580).

help-placeholder = Place cursor on a tag name, attribute, or { $ref } for documentation.

help-unsupported-ref-chain = Help for multi-part references like { $example } is not yet supported.

help-unresolved-ref =
    { $reason ->
        [notFound] No referent found for reference: { $ref }.
        [multiple] Multiple referents found for reference: { $ref }.
       *[indeterminate] A referent for { $ref } could not be determined.
    }

# Both links end in an arrow, which is direction rather than punctuation and is
# the same in every language this ships in — but it is inside the message, so a
# language written right to left can turn it around.
help-learn-about-references = Learn about references →
help-reference-page = Reference page →

# What can go where the cursor is. Two selectors joined: where the cursor sits,
# and what the schema allows there.
help-suggestions-header =
    { $location ->
        [inside] Inside { $element }
       *[top] At the top level
    }{ $allowed ->
        [none] { " — nothing goes here." }
        [text] { " — type text here." }
        [text-and-components] { " — type text here, or try:" }
       *[components] { " — things to try:" }
    }

# `$shortcut` is a key combination and stays as written. `$total` is a real
# count, so a language that agrees a noun with it can select on it.
help-suggestions-footer = Press { $shortcut } to see all { $total } components.

# An element's name joined to its one-line summary. `$name` is empty where the
# panel has already printed the name beside this — a suggestion in the list —
# and only the separator is wanted, so the message has to read as punctuation
# on its own.
help-name-summary = { $name } — { $summary }

# `$line` is text, not a number: it identifies a line, so line 1234 is "1234"
# and not "1,234". `none` is how a position that is not known selects a
# sentence without one rather than substituting an empty parenthesis.
help-ref-is-reference =
    { $line ->
        [none] { $ref } is a reference to { $target }.
       *[other] { $ref } is a reference to { $target } (line { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introduced by { $owner } as { $role }.
       *[other] Introduced by { $owner } on line { $line } as { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } is a reference to the { $property } property of { $element }.
       *[other] { $ref } is a reference to the { $property } property of { $element } (line { $line }).
    }

# The badge on the title row saying what kind of thing the panel is explaining.
help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = Default:
help-active-default = Active default:

# Appended after the active default's value. `styleNumber` is the attribute's
# own name and stays as written; the space and brackets around it do not.
help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Allowed values (one per item):
       *[other] Allowed values:
    }

# Heading for values the editor offers without requiring: the attribute accepts
# others too, and nothing warns about them. Distinct from `help-allowed-values`
# so a translation can pick a word that suggests rather than constrains.
help-suggested-values = Suggested values:

help-inserts = Inserts:

help-coordinates =
    { $count ->
        [one] Coordinate:
       *[other] Coordinates:
    }

help-type = Type:

help-resolved-style = Resolved style (styleNumber { $styleNumber }):

help-resolved-function-names = Resolved function names:
help-reset-list = Reset list on this input:
help-added-on-input = Added on this input:
help-removed-on-input = Removed on this input:

# The three names are attributes an author writes, so they stay as written.
help-reset-overrides = { $reset } overrides { $additional } and { $removed }.

# Length syntax for a `componentSize` attribute (`width`, `height`). The values
# listed alongside this label are examples the panel renders as chips.
help-accepted-sizes = Accepted sizes:
help-size-units = A bare number is pixels. A percentage is a share of the width around the component.

# For a `height`, which is offered no percentage: the note must not raise a form
# the attribute does not support.
help-size-units-absolute = A bare number is pixels.

# For a side-by-side `width`, which is offered no absolute form: the same rule,
# the other way round.
help-size-units-relative = A percentage is a share of the width around the component.

# `size` names a sibling attribute an author writes, so it stays as written.
help-size-snaps-to-preset = This width picks the nearest { $size } preset rather than being used exactly.
