# S'gaw Karen (ကညီကျိာ်) editor and language-server surfaces. Translated from
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
# S'gaw Karen in the S'gaw Karen script with the S'gaw signs ၢ ၣ ၤ, spaces between
# phrases, and no Pwo letters (ၦ, ၯ) anywhere. ဢ and ၡ are S'gaw letters no
# word in this catalog needs.
#
# **This is the file where the loans are heaviest, and it should be read as
# such.** The editor's own nouns are English almost without exception —
# `editor`, `viewer`, `variant`, `filter`, `component`, `attribute`,
# `reference`, `property`, `snippet`, `array entry`, `type`, `style`,
# `default`, `coordinate`, `function`, `line`, `tag`, `report`, `credit`,
# `accessibility`, `Answer Id` — **around a Karen frame**. What is Karen here
# is the word order (verb before object, modifier after head noun), the
# negative circumfix တ…ဘၣ်, the nominalizing prefix တၢ်, the declarative
# final လီၤ, and the ordinary verbs ဒုးနဲၣ် (show), ဃုထၢ (choose), ထံၣ်
# (find), အိၣ် (there is), မ့ၢ် (be), ဆီၣ် (press).
#
# **`editor-update-viewer`'s two words are Karen**: မၤသီထီၣ် ('make new')
# for Update and ပာ်က့ၤအလီၢ် ('put back in place') for Reset. Both sit on a
# narrow toolbar button and both are longer than the English; if they do not
# fit, that is a layout problem to report rather than a reason to shorten
# them wrongly.
#
# **What this catalog does not know.** The context-help panel's register —
# what a Karen-speaking mathematics teacher calls a reference, a property or a
# default — is not something this seed could establish, so those sentences are
# a Karen frame around the English words and read as such. The panel is the
# first place a speaker's rewriting will show.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ပာ်က့ၤအလီၢ်
       *[update] မၤသီထီၣ်
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } viewer
       *[other] { $word } viewer { $shortcut }
    }


## The variant picker

editor-variant = variant

editor-variant-filter = filter…

editor-variant-next = ဃုထၢ variant လၢခံ

editor-variant-previous = ဃုထၢ variant လၢညါ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] ထံၣ်န့ၢ် WCAG AA accessibility တၢ်ကမၣ် လီၤ။ ဆီၣ် ဒ်သိး က{ $action ->
            [close] ကးတံာ်
           *[open] အိးထီၣ်
        } accessibility report။
        [advisories] ဆီၣ် ဒ်သိး က{ $action ->
            [close] ကးတံာ်
           *[open] အိးထီၣ်
        } accessibility report။ WCAG AA တၢ်ကမၣ် တထံၣ်ဘၣ်ဆၣ် accessibility အဂ့ၢ် တၢ်ဟ့ၣ်ကူၣ် အဂၤ အိၣ်ဒံး လီၤ။
       *[clean] ဆီၣ် ဒ်သိး က{ $action ->
            [close] ကးတံာ်
           *[open] အိးထီၣ်
        } accessibility report။ accessibility အဂ့ၢ်ကီ တအိၣ်ဘၣ်။
    }

editor-accessibility-label =
    { $status ->
        [violations] ထံၣ်န့ၢ် WCAG AA accessibility တၢ်ကမၣ် လီၤ။ WCAG AA တၢ်ကမၣ် { $count } ခါ ထံၣ်န့ၢ်ဝဲ လီၤ။ ဆီၣ် ဒ်သိး က{ $action ->
            [close] ကးတံာ်
           *[open] အိးထီၣ်
        } accessibility report။
        [advisories] WCAG AA တၢ်ကမၣ် တထံၣ်ဘၣ်။ accessibility အဂ့ၢ် တၢ်ဟ့ၣ်ကူၣ် အဂၤ { $count } ခါ ထံၣ်န့ၢ်ဝဲ လီၤ။ ဆီၣ် ဒ်သိး က{ $action ->
            [close] ကးတံာ်
           *[open] အိးထီၣ်
        } accessibility report။
       *[clean] WCAG AA တၢ်ကမၣ် တထံၣ်ဘၣ်။ ဆီၣ် ဒ်သိး က{ $action ->
            [close] ကးတံာ်
           *[open] အိးထီၣ်
        } accessibility report။
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = တၢ်မၤစၢၤ လၢအလီၢ်အိၣ်ဝဲအသိး
editor-tab-help-short = တၢ်မၤစၢၤ
editor-tab-errors = တၢ်ကမၣ်
editor-tab-warnings = တၢ်ဟ့ၣ်ပလီၢ်
editor-tab-info = တၢ်ဂ့ၢ်တၢ်ကျိၤ
editor-tab-accessibility = accessibility
editor-tab-responses = တၢ်စံးဆၢ လၢဆှၢထီၣ်ဝဲ

editor-tab-with-count = { $label }: { $count }

editor-options = editor အတၢ်ဃုထၢ
editor-format-as-doenetml = ကွဲးကျဲၤ ဒ် DoenetML
editor-format-as-xml = ကွဲးကျဲၤ ဒ် XML


## The diagnostics panel

editor-diagnostic-line = line #{ $line }

editor-no-errors = တၢ်ကမၣ် တအိၣ်ဘၣ်
editor-no-warnings = တၢ်ဟ့ၣ်ပလီၢ် တအိၣ်ဘၣ်
editor-no-info = info diagnostic တအိၣ်ဘၣ်

editor-show-info-annotations = ဒုးနဲၣ် info diagnostic လၢ editor အပူၤ
editor-show-accessibility-annotations = ဒုးနဲၣ် accessibility diagnostic လၢ editor အပူၤ

editor-accessibility-learn-more = မၤလိကွၢ် Doenet မၤ accessibility ဒ်လဲၣ်

editor-accessibility-violations-heading = accessibility တၢ်ကမၣ် ({ $standard })

editor-accessibility-other-heading = accessibility အဂ့ၢ်ကီ အဂၤ
editor-none-found = တထံၣ်ဘၣ်နီတခါ


## Submitted responses

editor-no-responses = တၢ်စံးဆၢ လၢဆှၢထီၣ်ဝဲ တအိၣ်ဒံးဘၣ်
editor-response-answer-id = Answer Id
editor-response-response = တၢ်စံးဆၢ
editor-response-credit = credit
editor-response-submitted = ဆှၢထီၣ်ဝဲလံ


## The context-help panel

help-placeholder = documentation အဂီၢ် ပာ် cursor လၢ tag, attribute မ့တမ့ၢ် { $ref } အလိၤ တက့ၢ်။

help-unsupported-ref-chain = { $example } ဒ်သိးအံၤ reference လၢအအိၣ်ဒီးအကူာ်အါခါ အဂီၢ် တၢ်မၤစၢၤ တအိၣ်ဒံးဘၣ်။

help-unresolved-ref =
    { $reason ->
        [notFound] reference အဂီၢ် တၢ်လၢအဘၣ်ထွဲ တထံၣ်ဘၣ်: { $ref }။
        [multiple] reference အဂီၢ် တၢ်လၢအဘၣ်ထွဲ အါခါ ထံၣ်န့ၢ်ဝဲ: { $ref }။
       *[indeterminate] { $ref } အဂီၢ် တၢ်လၢအဘၣ်ထွဲ ပာ်ပနီၣ် တန့ၢ်ဘၣ်။
    }

help-learn-about-references = မၤလိကွၢ် reference အဂ့ၢ် →
help-reference-page = reference ကဘျံးပၤ →

help-suggestions-header =
    { $location ->
        [inside] { $element } အပူၤ
       *[top] top level အလိၤ
    }{ $allowed ->
        [none] { " — တၢ်နီတမံၤ ပာ်ဖှိၣ် တန့ၢ်ဘၣ်။" }
        [text] { " — ကွဲး text လၢအံၤ တက့ၢ်။" }
        [text-and-components] { " — ကွဲး text လၢအံၤ မ့တမ့ၢ် မၤကွၢ်:" }
       *[components] { " — တၢ်လၢမၤကွၢ်သ့:" }
    }

help-suggestions-footer = component ခဲလၢာ် { $total } ခါ ကွၢ်အဂီၢ် ဆီၣ် { $shortcut } တက့ၢ်။

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } မ့ၢ် { $target } အဂီၢ် reference လီၤ။
       *[other] { $ref } မ့ၢ် { $target } အဂီၢ် reference လီၤ (line { $line })။
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ပာ်ဖှိၣ်ဝဲ ဒ် { $role } လီၤ။
       *[other] { $owner } ပာ်ဖှိၣ်ဝဲ လၢ line { $line } အပူၤ ဒ် { $role } လီၤ။
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } မ့ၢ် { $element } အ property { $property } အဂီၢ် reference လီၤ။
       *[other] { $ref } မ့ၢ် { $element } အ property { $property } အဂီၢ် reference လီၤ (line { $line })။
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = default:
help-active-default = default လၢအမၤတၢ်ဒံး:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] တၢ်လုၢ်ပှ့ၤ လၢပာ်ဖှိၣ်သ့ (တခါစုာ်စုာ်):
       *[other] တၢ်လုၢ်ပှ့ၤ လၢပာ်ဖှိၣ်သ့:
    }

help-suggested-values = တၢ်လုၢ်ပှ့ၤ လၢဟ့ၣ်ကူၣ်ဝဲ:

help-inserts = ပာ်နုာ်လီၤ:

help-coordinates =
    { $count ->
       *[other] coordinate:
    }

help-type = type:

help-resolved-style = style လၢထုးထီၣ်န့ၢ်ဝဲ (styleNumber { $styleNumber }):

help-resolved-function-names = function အမံၤ လၢထုးထီၣ်န့ၢ်ဝဲ:
help-reset-list = input အံၤအလိၤ reset list:
help-added-on-input = input အံၤအလိၤ ပာ်ဖှိၣ်ဝဲ:
help-removed-on-input = input အံၤအလိၤ ထုးထီၣ်ကွံာ်ဝဲ:

help-reset-overrides = { $reset } မၤဂၢၤန့ၢ် { $additional } ဒီး { $removed } လီၤ။
