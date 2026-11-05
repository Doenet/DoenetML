# Inuktitut (ᐃᓄᒃᑎᑐᑦ) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay exactly as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Canadian Aboriginal syllabics, the Nunavut standard; the
# Latin qaliujaaqpait orthography is not mixed in. ᙱ (U+1671) is the doubled
# *nng*, not ᖏ (U+158F); ᕼ (U+157C) is the Inuktitut *h*, not the Cree final ᐦ
# (U+1426). `chrome.ftl` sets the series and the finals out in full. A hyphen
# onto a *literal* Latin identifier is used where the sentence needs a case —
# «DoenetML-ᒥᑎᑐᑦ» — but never onto a placeable, whose final sound this catalog
# never sees.
#
# **Number.** `iu` selects **one**, **two** and **other**, and the `two` is a
# real dual with its own ending. `editor-accessibility-label` writes all three
# branches; `chrome.ftl` explains the dual at length.
#
# **This is the thinnest of the four files, and the reason is specific.** The
# editor is a developer surface, and much of what it names — a *variant*, a
# *snippet*, an *array entry*, a *function*, an *attribute* — has no Inuktitut
# word in use and no settled syllabic transliteration either. Those words are
# written **in roman letters inside a syllabic sentence**, as `chrome.ftl` and
# `diagnostics.ftl` do, rather than being coined. `editor-tab-warnings` and
# `editor-no-warnings` use «ᐅᔾᔨᖅᓱᖁᔨᔾᔪᑦ», which `chrome.ftl` flags as this
# batch's one coinage. What is still **left out** is the part of the
# context-help panel that is a whole sentence of language-server vocabulary —
# `help-placeholder`, `help-unsupported-ref-chain`, `help-unresolved-ref`,
# `help-ref-is-reference`, `help-ref-derived-from`,
# `help-property-is-reference`, `help-resolved-style`,
# `help-suggestions-header` and `help-suggestions-footer` — nine keys, which
# fall back to English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ᐅᑎᖅᑎᒃᑯ
       *[update] ᓄᑖᙳᖅᑎᒃᑯ
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] ᑕᑯᒃᓴᐅᑎᑦᑎᔾᔪᑎ { $word }
       *[other] ᑕᑯᒃᓴᐅᑎᑦᑎᔾᔪᑎ { $word } { $shortcut }
    }


## The variant picker

editor-variant = variant
editor-variant-filter = ᖃᐅᔨᒃᑲᐃᓗᑎᑦ...
editor-variant-next = variant ᑭᖑᓪᓕᖅ ᓂᕈᐊᕐᓗᒍ
editor-variant-previous = variant ᓯᕗᓪᓕᖅ ᓂᕈᐊᕐᓗᒍ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᒪᓕᒃᑕᐅᙱᑦᑐᖅ ᓇᓂᔭᐅᔪᖅ. ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᐅᓂᒃᑳᖅ { $action ->
            [close] ᒪᑐᓗᒍ
           *[open] ᐅᒃᑯᐃᕐᓗᒍ
        } ᓇᕿᓪᓗᒍ.
        [advisories] ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᐅᓂᒃᑳᖅ { $action ->
            [close] ᒪᑐᓗᒍ
           *[open] ᐅᒃᑯᐃᕐᓗᒍ
        } ᓇᕿᓪᓗᒍ. WCAG AA ᒪᓕᒃᑕᐅᙱᑦᑐᖃᙱᑦᑐᖅ, ᑭᓯᐊᓂ ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᐅᖃᐅᓯᒃᓴᖃᖅᑐᖅ.
       *[clean] ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᐅᓂᒃᑳᖅ { $action ->
            [close] ᒪᑐᓗᒍ
           *[open] ᐅᒃᑯᐃᕐᓗᒍ
        } ᓇᕿᓪᓗᒍ. ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᐊᒃᓱᕈᕐᓇᖅᑐᖃᙱᑦᑐᖅ.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᒪᓕᒃᑕᐅᙱᑦᑐᖅ ᓇᓂᔭᐅᔪᖅ. { $count ->
            [one] WCAG AA ᒪᓕᒃᑕᐅᙱᑦᑐᖅ { $count }
            [two] WCAG AA ᒪᓕᒃᑕᐅᙱᑦᑑᒃ { $count }
           *[other] WCAG AA ᒪᓕᒃᑕᐅᙱᑦᑐᑦ { $count }
        } ᓇᓂᔭᐅᔪᑦ. ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᐅᓂᒃᑳᖅ { $action ->
            [close] ᒪᑐᓗᒍ
           *[open] ᐅᒃᑯᐃᕐᓗᒍ
        } ᓇᕿᓪᓗᒍ.
        [advisories] WCAG AA ᒪᓕᒃᑕᐅᙱᑦᑐᖃᙱᑦᑐᖅ. ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᐅᖃᐅᓯᒃᓴᖅ { $count } ᓇᓂᔭᐅᔪᑦ. ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᐅᓂᒃᑳᖅ { $action ->
            [close] ᒪᑐᓗᒍ
           *[open] ᐅᒃᑯᐃᕐᓗᒍ
        } ᓇᕿᓪᓗᒍ.
       *[clean] WCAG AA ᒪᓕᒃᑕᐅᙱᑦᑐᖃᙱᑦᑐᖅ. ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᐅᓂᒃᑳᖅ { $action ->
            [close] ᒪᑐᓗᒍ
           *[open] ᐅᒃᑯᐃᕐᓗᒍ
        } ᓇᕿᓪᓗᒍ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML { $version }

editor-tab-help = ᐃᑲᔫᑦ
editor-tab-help-short = ᐃᑲᔫᑦ
editor-tab-errors = ᑕᒻᒪᕐᓃᑦ
editor-tab-warnings = ᐅᔾᔨᖅᓱᖁᔨᔾᔪᑏᑦ
editor-tab-info = ᑐᑭᓯᒋᐊᕈᑏᑦ
editor-tab-accessibility = ᐊᑐᕈᓐᓇᕐᓂᖅ
editor-tab-responses = ᑭᐅᔾᔪᑏᑦ ᐊᐅᓪᓚᖅᑎᑕᐅᓯᒪᔪᑦ
editor-tab-with-count = { $label }: { $count }

editor-options = ᐊᑐᕈᓐᓇᖅᑐᑦ
editor-format-as-doenetml = DoenetML-ᒥᑎᑐᑦ ᐋᖅᑭᒃᓱᐃᓗᒍ
editor-format-as-xml = XML-ᒥᑎᑐᑦ ᐋᖅᑭᒃᓱᐃᓗᒍ


## The diagnostics panel

editor-diagnostic-line = ᑎᑎᕋᖅᓯᒪᔪᖅ #{ $line }

editor-no-errors = ᑕᒻᒪᕐᓂᖃᙱᑦᑐᖅ
editor-no-warnings = ᐅᔾᔨᖅᓱᖁᔨᔾᔪᑎᖃᙱᑦᑐᖅ
editor-no-info = ᑐᑭᓯᒋᐊᕈᑎᖃᙱᑦᑐᖅ

editor-show-info-annotations = ᑐᑭᓯᒋᐊᕈᑏᑦ ᑕᑯᒃᓴᐅᑎᑦᑎᒋᑦ
editor-show-accessibility-annotations = ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᑐᑭᓯᒋᐊᕈᑏᑦ ᑕᑯᒃᓴᐅᑎᑦᑎᒋᑦ

editor-accessibility-learn-more = ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᑐᑭᓯᒋᐊᒃᑲᓐᓂᕆᑦ
editor-accessibility-violations-heading = ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᒪᓕᒃᑕᐅᙱᑦᑐᑦ ({ $standard })
editor-accessibility-other-heading = ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᐊᓯᖏᑦ
editor-none-found = ᓇᓂᔭᐅᙱᑦᑐᖅ


## Submitted responses

editor-no-responses = ᓱᓕ ᑭᐅᔾᔪᑎᖃᙱᑦᑐᖅ
editor-response-answer-id = ᑭᐅᔾᔪᑎᐅᑉ ᐊᑎᖓ
editor-response-response = ᑭᐅᔾᔪᑎ
editor-response-credit = ᐱᔭᒃᓴᖅ
editor-response-submitted = ᐊᐅᓪᓚᖅᑎᑕᐅᔪᖅ


## The context-help panel

help-learn-about-references = ᑐᑭᓯᒋᐊᒃᑲᓐᓂᕆᑦ →
help-reference-page = ᒪᒃᐱᒐᖅ →

help-name-summary = { $name } — { $summary }
help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-default = ᐊᑐᖅᑕᐅᕙᒃᑐᖅ:
help-active-default = ᒫᓐᓇ ᐊᑐᖅᑕᐅᔪᖅ:
help-suggested-values = ᐊᑐᕈᓐᓇᖅᑐᑦ:
help-type = ᓱᓇᐅᓂᖓ:
help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array ᐃᓚᖓ
help-inserts = ᐃᓚᓯᔾᔪᑏᑦ:
help-resolved-function-names = function ᐊᑏᑦ:
help-reset-list = ᐅᑎᖅᑎᑕᐅᔪᑦ:
help-added-on-input = ᐃᓚᒋᐊᖅᑕᐅᔪᑦ:
help-removed-on-input = ᐲᔭᖅᑕᐅᔪᑦ:
help-reset-overrides = { $reset } { $additional } ᐊᒻᒪ { $removed } ᓯᕗᓕᖅᐹ.
help-allowed-values =
    { $perItem ->
        [true] ᐊᑐᕈᓐᓇᖅᑐᑦ (ᐊᑕᐅᓯᐊᖅᖢᑎᒃ):
       *[other] ᐊᑐᕈᓐᓇᖅᑐᑦ:
    }
help-coordinates =
    { $count ->
        [one] ᓇᓗᓇᐃᒃᑯᑕᖅ:
        [two] ᓇᓗᓇᐃᒃᑯᑏᒃ:
       *[other] ᓇᓗᓇᐃᒃᑯᑏᑦ:
    }
