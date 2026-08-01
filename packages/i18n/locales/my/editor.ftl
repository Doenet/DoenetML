# Burmese editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Element names, attribute names, `styleNumber`, `WCAG AA` and version numbers
# are identifiers rather than prose and stay exactly as written.
#
# Burmese has a single plural category, so a plural selector is written with
# its default variant alone. This file is Unicode, not Zawgyi.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ပြန်လည်သတ်မှတ်
       *[update] မွမ်းမံ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ကြည့်ရှုစနစ်ကို { $word }ရန်
       *[other] ကြည့်ရှုစနစ်ကို { $word }ရန် { $shortcut }
    }


## The variant picker

editor-variant = မူကွဲ
editor-variant-filter = စစ်ထုတ်ရန်...
editor-variant-next = နောက်မူကွဲကို ရွေးရန်
editor-variant-previous = ယခင်မူကွဲကို ရွေးရန်


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA အသုံးပြုနိုင်စွမ်း ချိုးဖောက်မှု တွေ့ရသည်။ အသုံးပြုနိုင်စွမ်း အစီရင်ခံစာကို { $action ->
            [close] ပိတ်ရန်
           *[open] ဖွင့်ရန်
        } နှိပ်ပါ။
        [advisories] အသုံးပြုနိုင်စွမ်း အစီရင်ခံစာကို { $action ->
            [close] ပိတ်ရန်
           *[open] ဖွင့်ရန်
        } နှိပ်ပါ။ WCAG AA ချိုးဖောက်မှု မတွေ့ရသော်လည်း အသုံးပြုနိုင်စွမ်းဆိုင်ရာ အကြံပြုချက်များ ရှိသည်။
       *[clean] အသုံးပြုနိုင်စွမ်း အစီရင်ခံစာကို { $action ->
            [close] ပိတ်ရန်
           *[open] ဖွင့်ရန်
        } နှိပ်ပါ။ အသုံးပြုနိုင်စွမ်းဆိုင်ရာ ပြဿနာ မတွေ့ရပါ။
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA အသုံးပြုနိုင်စွမ်း ချိုးဖောက်မှု တွေ့ရသည်။ { $count ->
           *[other] WCAG AA ချိုးဖောက်မှု { $count } ခု
        } တွေ့ရသည်။ အသုံးပြုနိုင်စွမ်း အစီရင်ခံစာကို { $action ->
            [close] ပိတ်ရန်
           *[open] ဖွင့်ရန်
        } နှိပ်ပါ။
        [advisories] WCAG AA ချိုးဖောက်မှု မတွေ့ရပါ။ { $count ->
           *[other] နောက်ထပ် အသုံးပြုနိုင်စွမ်း အကြံပြုချက် { $count } ခု
        } တွေ့ရသည်။ အသုံးပြုနိုင်စွမ်း အစီရင်ခံစာကို { $action ->
            [close] ပိတ်ရန်
           *[open] ဖွင့်ရန်
        } နှိပ်ပါ။
       *[clean] WCAG AA ချိုးဖောက်မှု မတွေ့ရပါ။ အသုံးပြုနိုင်စွမ်း အစီရင်ခံစာကို { $action ->
            [close] ပိတ်ရန်
           *[open] ဖွင့်ရန်
        } နှိပ်ပါ။
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ဗားရှင်း { $version }

editor-tab-help = အခြေအနေအလိုက် အကူအညီ
editor-tab-help-short = အခြေအနေ
editor-tab-errors = အမှားများ
editor-tab-warnings = သတိပေးချက်များ
editor-tab-info = အချက်အလက်
editor-tab-accessibility = အသုံးပြုနိုင်စွမ်း
editor-tab-responses = တင်သွင်းထားသော အဖြေများ

editor-tab-with-count = { $label }: { $count }

editor-options = တည်းဖြတ်စနစ် ရွေးချယ်စရာများ
editor-format-as-doenetml = DoenetML အဖြစ် စီစဉ်ရန်
editor-format-as-xml = XML အဖြစ် စီစဉ်ရန်


## The diagnostics panel

editor-diagnostic-line = စာကြောင်း #{ $line }

editor-no-errors = အမှား မရှိပါ
editor-no-warnings = သတိပေးချက် မရှိပါ
editor-no-info = အချက်အလက်ဆိုင်ရာ ညွှန်ကြားချက် မရှိပါ

editor-show-info-annotations = တည်းဖြတ်စနစ်တွင် အချက်အလက်ဆိုင်ရာ ညွှန်ကြားချက်များ ပြရန်
editor-show-accessibility-annotations = တည်းဖြတ်စနစ်တွင် အသုံးပြုနိုင်စွမ်း ညွှန်ကြားချက်များ ပြရန်

editor-accessibility-learn-more = Doenet က အသုံးပြုနိုင်စွမ်းကို မည်သို့ချဉ်းကပ်သည်ကို လေ့လာရန်

editor-accessibility-violations-heading = အသုံးပြုနိုင်စွမ်း ချိုးဖောက်မှုများ ({ $standard })

editor-accessibility-other-heading = အခြား အသုံးပြုနိုင်စွမ်း ပြဿနာများ
editor-none-found = မတွေ့ရပါ


## Submitted responses

editor-no-responses = ယခုအထိ တင်သွင်းထားသော အဖြေ မရှိပါ
editor-response-answer-id = အဖြေ အိုင်ဒီ
editor-response-response = အဖြေ
editor-response-credit = အမှတ်
editor-response-submitted = တင်သွင်းပြီး


## The context-help panel

help-placeholder = စာရွက်စာတမ်းအတွက် ကာဆာကို တဂ်အမည်၊ အက်ထရီဗျုစ် သို့မဟုတ် { $ref } ပေါ်တွင် ထားပါ။

help-unsupported-ref-chain = { $example }ကဲ့သို့ အပိုင်းများစွာပါသော ရည်ညွှန်းချက်များအတွက် အကူအညီကို မပံ့ပိုးရသေးပါ။

help-unresolved-ref =
    { $reason ->
        [notFound] ရည်ညွှန်းချက်အတွက် ပစ်မှတ် မတွေ့ရပါ: { $ref }။
        [multiple] ရည်ညွှန်းချက်အတွက် ပစ်မှတ်များစွာ တွေ့ရသည်: { $ref }။
       *[indeterminate] { $ref } ၏ ပစ်မှတ်ကို မဆုံးဖြတ်နိုင်ပါ။
    }

help-learn-about-references = ရည်ညွှန်းချက်များအကြောင်း လေ့လာရန် →
help-reference-page = ရည်ညွှန်းစာမျက်နှာ →

help-suggestions-header =
    { $location ->
        [inside] { $element } အတွင်း
       *[top] အထက်ဆုံးအဆင့်တွင်
    }{ $allowed ->
        [none] { " — ဤနေရာတွင် ဘာမျှ မထည့်ရပါ။" }
        [text] { " — ဤနေရာတွင် စာသား ရိုက်ပါ။" }
        [text-and-components] { " — ဤနေရာတွင် စာသား ရိုက်ပါ၊ သို့မဟုတ် စမ်းကြည့်ပါ:" }
       *[components] { " — စမ်းကြည့်စရာများ:" }
    }

help-suggestions-footer = အစိတ်အပိုင်း { $total } ခုလုံးကို ကြည့်ရန် { $shortcut } ကို နှိပ်ပါ။

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } သည် { $target } ကို ရည်ညွှန်းသည်။
       *[other] { $ref } သည် { $target } ကို ရည်ညွှန်းသည် (စာကြောင်း { $line })။
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } က ၎င်းကို { $role } အဖြစ် မိတ်ဆက်သည်။
       *[other] { $owner } က ၎င်းကို စာကြောင်း { $line } တွင် { $role } အဖြစ် မိတ်ဆက်သည်။
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } သည် { $element } ၏ { $property } ဂုဏ်သတ္တိကို ရည်ညွှန်းသည်။
       *[other] { $ref } သည် { $element } ၏ { $property } ဂုဏ်သတ္တိကို ရည်ညွှန်းသည် (စာကြောင်း { $line })။
    }

help-kind-attribute = အက်ထရီဗျုစ်
help-kind-snippet = အပိုင်းအစ
help-kind-array-entry = အခင်း ထည့်သွင်းချက်

help-default = ပုံသေတန်ဖိုး:
help-active-default = သက်ဝင်နေသော ပုံသေတန်ဖိုး:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ခွင့်ပြုတန်ဖိုးများ (တစ်ခုစီအတွက် တစ်ခု):
       *[other] ခွင့်ပြုတန်ဖိုးများ:
    }

help-suggested-values = အကြံပြုတန်ဖိုးများ:

help-inserts = ထည့်သွင်းသည်:

help-coordinates =
    { $count ->
       *[other] သြဒိနိတ်များ:
    }

help-type = အမျိုးအစား:

help-resolved-style = ဆုံးဖြတ်ပြီး စတိုင် (styleNumber { $styleNumber }):

help-resolved-function-names = ဆုံးဖြတ်ပြီး ဖန်ရှင်အမည်များ:
help-reset-list = ဤထည့်သွင်းမှုတွင် စာရင်း ပြန်လည်သတ်မှတ်ရန်:
help-added-on-input = ဤထည့်သွင်းမှုတွင် ထည့်ထားသည်:
help-removed-on-input = ဤထည့်သွင်းမှုတွင် ဖယ်ထားသည်:

help-reset-overrides = { $reset } သည် { $additional } နှင့် { $removed } ကို လွှမ်းမိုးသည်။
