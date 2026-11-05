# Mon (ဘာသာမန်) editor and language-server surfaces. Translated from
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
# Mon in the Mon-Burmese script with the Mon letters ၚ ၜ and the medials
# ၞ ၟ ၠ — never Burmese င for Mon ၚ — and Burmese spacing.
#
# **This is the file where the loans are heaviest, and it should be read as
# such.** The editor's own nouns are English almost without exception —
# `editor`, `viewer`, `variant`, `filter`, `component`, `attribute`,
# `reference`, `property`, `snippet`, `array entry`, `type`, `style`,
# `default`, `coordinate`, `function`, `line`, `tag`, `report`, `credit`,
# `accessibility`, `Answer Id` — **around a Mon frame**. What is Mon here is
# the word order (verb before object, modifier after head noun), the
# relativizer မ with the perfective လဝ်, and the ordinary verbs ထ္ၜး (show),
# ရုဲ (choose), ဆဵု (find), နွံ (there is), ဒှ် (be), ဍဵု (press). The
# Burmese loans, in Burmese spelling, are သတိပေးချက် (warning), အချက်အလက်
# (information) and အကြံပြုချက် (recommendation).
#
# **`editor-update-viewer`'s two words are Mon**: ပလေဝ် ('put right, revise')
# for Update and ကလေၚ်စွံ ('set back') for Reset. Both sit on a narrow
# toolbar button; if they do not fit, that is a layout problem to report
# rather than a reason to shorten them wrongly.
#
# **What this catalog does not know.** The context-help panel's register —
# what a Mon-speaking mathematics teacher calls a reference, a property or a
# default — is not something this seed could establish, so those sentences are
# a Mon frame around the English words and read as such. The panel is the
# first place a speaker's rewriting will show.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ကလေၚ်စွံ
       *[update] ပလေဝ်
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } viewer
       *[other] { $word } viewer { $shortcut }
    }


## The variant picker

editor-variant = variant

editor-variant-filter = filter…

editor-variant-next = ရုဲ variant လက္ကရဴ

editor-variant-previous = ရုဲ variant ကၠာ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] ဆဵုကေတ် WCAG AA accessibility တၚ်ဗၠေတ် ရ။ ဍဵု သွက်ဂွံ{ $action ->
            [close] ကၟာတ်
           *[open] ပံက်
        } accessibility report။
        [advisories] ဍဵု သွက်ဂွံ{ $action ->
            [close] ကၟာတ်
           *[open] ပံက်
        } accessibility report။ WCAG AA တၚ်ဗၠေတ် ဟွံဆဵု ကီုလေဝ် အကြံပြုချက် accessibility တၞဟ် နွံမံၚ်ရ။
       *[clean] ဍဵု သွက်ဂွံ{ $action ->
            [close] ကၟာတ်
           *[open] ပံက်
        } accessibility report။ တၚ်ပြသၞာ accessibility မွဲမွဲ ဟွံဆဵု။
    }

editor-accessibility-label =
    { $status ->
        [violations] ဆဵုကေတ် WCAG AA accessibility တၚ်ဗၠေတ် ရ။ WCAG AA တၚ်ဗၠေတ် { $count } တၚ် ဆဵုကေတ်။ ဍဵု သွက်ဂွံ{ $action ->
            [close] ကၟာတ်
           *[open] ပံက်
        } accessibility report။
        [advisories] WCAG AA တၚ်ဗၠေတ် ဟွံဆဵု။ အကြံပြုချက် accessibility တၞဟ် { $count } တၚ် ဆဵုကေတ်။ ဍဵု သွက်ဂွံ{ $action ->
            [close] ကၟာတ်
           *[open] ပံက်
        } accessibility report။
       *[clean] WCAG AA တၚ်ဗၠေတ် ဟွံဆဵု။ ဍဵု သွက်ဂွံ{ $action ->
            [close] ကၟာတ်
           *[open] ပံက်
        } accessibility report။
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = တၚ်ရီုဗၚ် ဗွဲမလုပ်စ ကုအရာမနွံ
editor-tab-help-short = ရီုဗၚ်
editor-tab-errors = တၚ်ဗၠေတ်
editor-tab-warnings = သတိပေးချက်
editor-tab-info = အချက်အလက်
editor-tab-accessibility = accessibility
editor-tab-responses = သွဟ် မပ္တိုန်လဝ်

editor-tab-with-count = { $label }: { $count }

editor-options = တၚ်ရုဲစှ် နူ editor
editor-format-as-doenetml = ဗီုပြၚ် ဒှ် DoenetML
editor-format-as-xml = ဗီုပြၚ် ဒှ် XML


## The diagnostics panel

editor-diagnostic-line = line #{ $line }

editor-no-errors = တၚ်ဗၠေတ် ဟွံမွဲ
editor-no-warnings = သတိပေးချက် ဟွံမွဲ
editor-no-info = info diagnostic ဟွံမွဲ

editor-show-info-annotations = ထ္ၜး info diagnostic ပ္ဍဲ editor
editor-show-accessibility-annotations = ထ္ၜး accessibility diagnostic ပ္ဍဲ editor

editor-accessibility-learn-more = ဗ္တောန်ကေတ် ပရူ Doenet ကၠောန်ဗဒှ် accessibility

editor-accessibility-violations-heading = accessibility တၚ်ဗၠေတ် ({ $standard })

editor-accessibility-other-heading = တၚ်ပြသၞာ accessibility တၞဟ်
editor-none-found = မွဲမွဲ ဟွံဆဵု


## Submitted responses

editor-no-responses = သွဟ် မပ္တိုန်လဝ် ဟွံမွဲဏီ
editor-response-answer-id = Answer Id
editor-response-response = သွဟ်
editor-response-credit = credit
editor-response-submitted = ပ္တိုန်လဝ်


## The context-help panel

help-placeholder = စွံ cursor ပ္ဍဲ tag, attribute ဟွံသေၚ် { $ref } သွက်ဂွံရံၚ် documentation။

help-unsupported-ref-chain = reference ဗွဲမဂၠိုၚ်တၞး ဗီုကဵု { $example } ဂှ် ဟွံကၠောန်လဝ်ဏီ။

help-unresolved-ref =
    { $reason ->
        [notFound] အရာ မဆေၚ်စပ် ကု reference ဟွံဆဵု: { $ref }။
        [multiple] အရာ မဆေၚ်စပ် ကု reference ဂၠိုၚ်တၞး ဆဵုကေတ်: { $ref }။
       *[indeterminate] အရာ မဆေၚ်စပ် ကု { $ref } ဂှ် စၟတ်သမ္တီ ဟွံဂွံ။
    }

help-learn-about-references = ဗ္တောန်ကေတ် ပရူ reference →
help-reference-page = မုက်လိက် reference →

help-suggestions-header =
    { $location ->
        [inside] ပ္ဍဲ { $element }
       *[top] ပ္ဍဲ top level
    }{ $allowed ->
        [none] { " — မွဲမွဲ စုတ်ဟွံဂွံ။" }
        [text] { " — စုတ် text ဗွဲမဒှ်။" }
        [text-and-components] { " — စုတ် text ဟွံသေၚ် စမ်ရံၚ်:" }
       *[components] { " — အရာ မစမ်ရံၚ်ဂွံ:" }
    }

help-suggestions-footer = ဍဵု { $shortcut } သွက်ဂွံရံၚ် component အလုံ { $total } တၞး။

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ဂှ် reference ကု { $target } ရ။
       *[other] { $ref } ဂှ် reference ကု { $target } ရ (line { $line })။
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } စုတ်လဝ် ဒှ် { $role }။
       *[other] { $owner } စုတ်လဝ် ပ္ဍဲ line { $line } ဒှ် { $role }။
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ဂှ် reference ကု property { $property } နူ { $element } ရ။
       *[other] { $ref } ဂှ် reference ကု property { $property } နူ { $element } ရ (line { $line })။
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = default:
help-active-default = default မသုၚ်စောဲမံၚ်:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] တန်ဖိုး မစုတ်ဂွံ (မွဲတၞးမွဲ):
       *[other] တန်ဖိုး မစုတ်ဂွံ:
    }

help-suggested-values = တန်ဖိုး မဒုၚ်သဇိုၚ်:

help-inserts = စုတ်ကဵု:

help-coordinates =
    { $count ->
       *[other] coordinate:
    }

help-type = type:

help-resolved-style = style မတိတ်ကၠုၚ် (styleNumber { $styleNumber }):

help-resolved-function-names = ယၟု function မတိတ်ကၠုၚ်:
help-reset-list = reset list ပ္ဍဲ input ဏအ်:
help-added-on-input = စုတ်လဝ် ပ္ဍဲ input ဏအ်:
help-removed-on-input = ပတိတ်လဝ် ပ္ဍဲ input ဏအ်:

help-reset-overrides = { $reset } ဂှ် အာလ္ပာ်လတူ { $additional } ကဵု { $removed } ရ။
