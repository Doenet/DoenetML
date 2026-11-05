# Scots editor and language-server surfaces: the footer, the diagnostics panel,
# the variant picker, the accessibility button and the context-help panel.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Scots looks like the source**; see `chrome.ftl` for the whole note. This
# file is the one of the four where the resemblance is greatest, because a
# developer-facing panel is mostly technical nouns, and Scots takes the same
# ones English does.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay as
# `locales/en` writes them. So do the DoenetML identifiers `styleNumber` and
# the attribute names in `help-reset-overrides`.
#
# **Number.** CLDR has no plural rules for `sco`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere: nothing could select one. Every symbolic
# selector — `$action`, `$status`, `$shortcut`, `$reason`, `$location`,
# `$allowed`, `$line`, `$perItem` — is kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reset
       *[update] Update
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } the Viewer
       *[other] { $word } the Viewer { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Sift…
editor-variant-next = Wale the neist variant
editor-variant-previous = Wale the variant afore


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] A WCAG AA accessibility brek haes been fund. Click tae { $action ->
            [close] steek
           *[open] open
        } the accessibility report.
        [advisories] Click tae { $action ->
            [close] steek
           *[open] open
        } the accessibility report. Nae WCAG AA breks war fund, but there are mair accessibility recommendations tae be haen.
       *[clean] Click tae { $action ->
            [close] steek
           *[open] open
        } the accessibility report. Nae accessibility bothers war fund.
    }

editor-accessibility-label =
    { $status ->
        [violations] A WCAG AA accessibility brek haes been fund. { $count ->
            [one] { $count } WCAG AA brek
           *[other] { $count } WCAG AA breks
        } fund. Click tae { $action ->
            [close] steek
           *[open] open
        } the accessibility report.
        [advisories] Nae WCAG AA breks war fund. { $count ->
            [one] { $count } mair accessibility recommendation
           *[other] { $count } mair accessibility recommendations
        } fund. Click tae { $action ->
            [close] steek
           *[open] open
        } the accessibility report.
       *[clean] Nae WCAG AA breks war fund. Click tae { $action ->
            [close] steek
           *[open] open
        } the accessibility report.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Help for whaur ye are
editor-tab-help-short = Context
editor-tab-errors = Mistaks
editor-tab-warnings = Warnins
editor-tab-info = Info
editor-tab-accessibility = Accessibility
editor-tab-responses = Sent repones

editor-tab-with-count = { $label }: { $count }

editor-options = Editor settins
editor-format-as-doenetml = Format as DoenetML
editor-format-as-xml = Format as XML


## The diagnostics panel

editor-diagnostic-line = Line #{ $line }

editor-no-errors = Nae Mistaks
editor-no-warnings = Nae Warnins
editor-no-info = Nae Info Notices

editor-show-info-annotations = Shaw info notices in the editor
editor-show-accessibility-annotations = Shaw accessibility notices in the editor

editor-accessibility-learn-more = Lairn hou Doenet gangs aboot accessibility

editor-accessibility-violations-heading = Accessibility breks ({ $standard })

editor-accessibility-other-heading = Ither accessibility bothers
editor-none-found = Nane fund


## Submitted responses

editor-no-responses = Nae repones sent yet
editor-response-answer-id = Answer Id
editor-response-response = Repone
editor-response-credit = Credit
editor-response-submitted = Sent


## The context-help panel

help-placeholder = Set the cursor on a tag name, an attribute, or { $ref } for documentation.

help-unsupported-ref-chain = Help for mony-pairtit references like { $example } isna ready yet.

help-unresolved-ref =
    { $reason ->
        [notFound] Nae referent fund for the reference: { $ref }.
        [multiple] Mony referents fund for the reference: { $ref }.
       *[indeterminate] A referent for { $ref } couldna be sattelt.
    }

help-learn-about-references = Lairn aboot references →
help-reference-page = Reference page →

help-suggestions-header =
    { $location ->
        [inside] Inby { $element }
       *[top] At the tap level
    }{ $allowed ->
        [none] { " — naethin gangs here." }
        [text] { " — type text here." }
        [text-and-components] { " — type text here, or try:" }
       *[components] { " — things tae try:" }
    }

help-suggestions-footer = Press { $shortcut } tae see aa { $total } components.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } is a reference tae { $target }.
       *[other] { $ref } is a reference tae { $target } (line { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Brocht in by { $owner } as { $role }.
       *[other] Brocht in by { $owner } on line { $line } as { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } is a reference tae the { $property } property o { $element }.
       *[other] { $ref } is a reference tae the { $property } property o { $element } (line { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = Default:
help-active-default = Active default:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Values alloued (ane for ilka item):
       *[other] Values alloued:
    }

help-suggested-values = Values suggestit:

help-inserts = Pits in:

help-coordinates =
    { $count ->
        [one] Coordinate:
       *[other] Coordinates:
    }

help-type = Type:

help-resolved-style = Wrocht-oot style (styleNumber { $styleNumber }):

help-resolved-function-names = Wrocht-oot function names:
help-reset-list = Reset list on this input:
help-added-on-input = Eikit on this input:
help-removed-on-input = Taen awa on this input:

help-reset-overrides = { $reset } owergangs { $additional } an { $removed }.
