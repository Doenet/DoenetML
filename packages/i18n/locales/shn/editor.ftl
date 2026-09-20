# Shan (လိၵ်ႈတႆး) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety, script and spacing** are as `chrome.ftl`'s header sets them out:
# modern reformed Shan orthography with the Shan letters ၵ ၶ ၸ ၺ ၼ ပ ၽ ၾ ႁ ဢ,
# the Shan vowels ႃ ႄ ႅ ႆ ွ ႂ and the Shan tone marks ႇ ႈ း ႉ ႊ — never their
# Burmese look-alikes — and spaces between words.
#
# **This is the file where the loans are heaviest, and it should be read as
# such.** The editor's own nouns are English almost without exception —
# `editor`, `viewer`, `variant`, `filter`, `component`, `attribute`,
# `reference`, `property`, `snippet`, `array entry`, `type`, `style`,
# `default`, `coordinate`, `function`, `line`, `tag`, `report`, `credit`,
# `accessibility`, `Answer Id` — **around a Shan frame**. What is Shan here is
# the word order (verb before object, modifier after head noun), the
# postposed relative ဢၼ်, and the ordinary verbs ၼႄ (show), လိူၵ်ႈ (choose),
# ႁႃ (look for), ႁၼ် (find), မီး (have), ပဵၼ် (be), နဵၵ်း (press). The Burmese
# loans, in Burmese spelling, are သတိပေးချက် (warning), အချက်အလက်
# (information) and ၶေႃႈၸီႉၼႄ's neighbour အကြံပြုချက် (recommendation).
#
# **`editor-update-viewer`'s two words are Shan**: မႄးမႂ်ႇ ('renew') for
# Update and ၶိုၼ်းတင်ႈ ('set again') for Reset. Both sit on a narrow toolbar
# button and both are longer than the English; if they do not fit, that is a
# layout problem to report rather than a reason to shorten them wrongly.
#
# **What this catalog does not know.** The context-help panel's register —
# what a Shan mathematics teacher actually calls a reference, a property or a
# default — is not something this seed could establish, so those sentences are
# a Shan frame around the English words and read as such. The panel is the
# first place a speaker's rewriting will show.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ၶိုၼ်းတင်ႈ
       *[update] မႄးမႂ်ႇ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } viewer
       *[other] { $word } viewer { $shortcut }
    }


## The variant picker

editor-variant = variant

editor-variant-filter = filter…

editor-variant-next = လိူၵ်ႈ variant တေႃႇၼႃႈ

editor-variant-previous = လိူၵ်ႈ variant ဢွၼ်တၢင်း


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] ႁၼ် WCAG AA accessibility ၽိတ်းပိူင်ႈ။ နဵၵ်း တႃႇ { $action ->
            [close] ပိၵ်ႉ
           *[open] ပိုတ်ႇ
        } accessibility report။
        [advisories] နဵၵ်း တႃႇ { $action ->
            [close] ပိၵ်ႉ
           *[open] ပိုတ်ႇ
        } accessibility report။ ဢမ်ႇႁၼ် WCAG AA ၽိတ်းပိူင်ႈ သေတႃႉ မီး အကြံပြုချက် accessibility ထႅင်ႈ။
       *[clean] နဵၵ်း တႃႇ { $action ->
            [close] ပိၵ်ႉ
           *[open] ပိုတ်ႇ
        } accessibility report။ ဢမ်ႇႁၼ် ပၼ်ႁႃ accessibility သင်။
    }

editor-accessibility-label =
    { $status ->
        [violations] ႁၼ် WCAG AA accessibility ၽိတ်းပိူင်ႈ။ ႁၼ် WCAG AA ၽိတ်းပိူင်ႈ { $count } ဢၼ်။ နဵၵ်း တႃႇ { $action ->
            [close] ပိၵ်ႉ
           *[open] ပိုတ်ႇ
        } accessibility report။
        [advisories] ဢမ်ႇႁၼ် WCAG AA ၽိတ်းပိူင်ႈ။ ႁၼ် အကြံပြုချက် accessibility ထႅင်ႈ { $count } ဢၼ်။ နဵၵ်း တႃႇ { $action ->
            [close] ပိၵ်ႉ
           *[open] ပိုတ်ႇ
        } accessibility report။
       *[clean] ဢမ်ႇႁၼ် WCAG AA ၽိတ်းပိူင်ႈ။ နဵၵ်း တႃႇ { $action ->
            [close] ပိၵ်ႉ
           *[open] ပိုတ်ႇ
        } accessibility report။
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = ၵၢၼ်ၸွႆႈထႅမ် ၸွမ်းၼင်ႇ ဢွင်ႈတီႈ
editor-tab-help-short = ၸွႆႈထႅမ်
editor-tab-errors = ၽိတ်းပိူင်ႈ
editor-tab-warnings = သတိပေးချက်
editor-tab-info = အချက်အလက်
editor-tab-accessibility = accessibility
editor-tab-responses = ၶေႃႈတွပ်ႇ ဢၼ်သူင်ႇယဝ်ႉ

editor-tab-with-count = { $label }: { $count }

editor-options = လွင်ႈလိူၵ်ႈ ၶွင် editor
editor-format-as-doenetml = ႁဵတ်းႁၢင်ႈ ပဵၼ် DoenetML
editor-format-as-xml = ႁဵတ်းႁၢင်ႈ ပဵၼ် XML


## The diagnostics panel

editor-diagnostic-line = line #{ $line }

editor-no-errors = ဢမ်ႇမီး ၽိတ်းပိူင်ႈ
editor-no-warnings = ဢမ်ႇမီး သတိပေးချက်
editor-no-info = ဢမ်ႇမီး info diagnostic

editor-show-info-annotations = ၼႄ info diagnostic ၼႂ်း editor
editor-show-accessibility-annotations = ၼႄ accessibility diagnostic ၼႂ်း editor

editor-accessibility-learn-more = ႁဵၼ်းႁူႉ လွင်ႈ Doenet ႁဵတ်းသၢင်ႈ accessibility

editor-accessibility-violations-heading = accessibility ၽိတ်းပိူင်ႈ ({ $standard })

editor-accessibility-other-heading = ပၼ်ႁႃ accessibility တၢင်ႇဢၼ်
editor-none-found = ဢမ်ႇႁၼ်သင်


## Submitted responses

editor-no-responses = ပႆႇမီး ၶေႃႈတွပ်ႇ ဢၼ်သူင်ႇယဝ်ႉ
editor-response-answer-id = Answer Id
editor-response-response = ၶေႃႈတွပ်ႇ
editor-response-credit = credit
editor-response-submitted = သူင်ႇယဝ်ႉ


## The context-help panel

help-placeholder = ဝၢင်း cursor တီႈ tag, attribute ဢမ်ႇၼၼ် { $ref } တႃႇ လူတူၺ်း documentation။

help-unsupported-ref-chain = ပႆႇႁဵတ်းဝႆႉ ၵၢၼ်ၸွႆႈထႅမ် တႃႇ reference လၢႆတွၼ်ႈ ၸိူင်ႉၼင်ႇ { $example }။

help-unresolved-ref =
    { $reason ->
        [notFound] ႁႃဢမ်ႇႁၼ် တီႈဢၼ် reference ၼႄ: { $ref }။
        [multiple] ႁၼ် တီႈဢၼ် reference ၼႄ လၢႆဢၼ်: { $ref }။
       *[indeterminate] မၵ်းမၼ်ႈဢမ်ႇလႆႈ တီႈဢၼ် { $ref } ၼႄ။
    }

help-learn-about-references = ႁဵၼ်းႁူႉ လွင်ႈ reference →
help-reference-page = ၼႃႈလိၵ်ႈ reference →

help-suggestions-header =
    { $location ->
        [inside] ၼႂ်း { $element }
       *[top] တီႈ top level
    }{ $allowed ->
        [none] { " — ဢမ်ႇသႂ်ႇလႆႈသင်တီႈၼႆႈ။" }
        [text] { " — သႂ်ႇ text တီႈၼႆႈ။" }
        [text-and-components] { " — သႂ်ႇ text တီႈၼႆႈ ဢမ်ႇၼၼ် ၸၢမ်းတူၺ်း:" }
       *[components] { " — ဢၼ်ၸၢမ်းလႆႈ:" }
    }

help-suggestions-footer = နဵၵ်း { $shortcut } တႃႇ တူၺ်း component ၵူႈဢၼ် { $total } ဢၼ်။

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ပဵၼ် reference ၸူး { $target }။
       *[other] { $ref } ပဵၼ် reference ၸူး { $target } (line { $line })။
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ဢွၼ်သႂ်ႇဝႆႉ ပဵၼ် { $role }။
       *[other] { $owner } ဢွၼ်သႂ်ႇဝႆႉ တီႈ line { $line } ပဵၼ် { $role }။
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ပဵၼ် reference ၸူး property { $property } ၶွင် { $element }။
       *[other] { $ref } ပဵၼ် reference ၸူး property { $property } ၶွင် { $element } (line { $line })။
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = default:
help-active-default = default ဢၼ်ၸႂ်ႉယူႇ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] တူဝ်ၵႃႈ ဢၼ်သႂ်ႇလႆႈ (ဢၼ်ၼိုင်ႈလႄႈဢၼ်ၼိုင်ႈ):
       *[other] တူဝ်ၵႃႈ ဢၼ်သႂ်ႇလႆႈ:
    }

help-suggested-values = တူဝ်ၵႃႈ ဢၼ်ၸီႉၼႄ:

help-inserts = သႂ်ႇပၼ်:

help-coordinates =
    { $count ->
       *[other] coordinate:
    }

help-type = type:

help-resolved-style = style ဢၼ်ဢွၵ်ႇမႃး (styleNumber { $styleNumber }):

help-resolved-function-names = ၸိုဝ်ႈ function ဢၼ်ဢွၵ်ႇမႃး:
help-reset-list = reset list တီႈ input ဢၼ်ၼႆႉ:
help-added-on-input = ထႅမ်သႂ်ႇ တီႈ input ဢၼ်ၼႆႉ:
help-removed-on-input = ဢဝ်ဢွၵ်ႇ တီႈ input ဢၼ်ၼႆႉ:

help-reset-overrides = { $reset } ၶိုၼ်ႈပူၼ်ႉ { $additional } လႄႈ { $removed }။
