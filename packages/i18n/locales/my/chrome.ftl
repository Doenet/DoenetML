# Burmese viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the -ရန် form Burmese puts on a button — ကီးဘုတ် ဖွင့်ရန် —
# which names the action rather than commanding the reader.
#
# CLDR gives Burmese a single plural category, so a plural selector is written
# with its default variant alone: `one` can never be chosen, and a branch that
# cannot be reached is worse than no branch. An explicit `[0]` is a numeric
# match rather than a category and still selects, which is how
# `attempts-remaining` says "no attempts left" below.
#
# This file is Unicode, not Zawgyi.


## Answer submission

answer-checking = စစ်ဆေးနေသည်...
answer-submitting = ပို့နေသည်...
answer-checking-status = အဖြေကို စစ်ဆေးနေသည်
answer-submitting-status = အဖြေကို ပို့နေသည်
answer-correct = မှန်
answer-incorrect = မှား
answer-response-saved = အဖြေကို သိမ်းဆည်းပြီး
answer-percent-credit = { $percent }% အမှတ်
answer-percent-correct = { $percent }% မှန်
answer-percent-short = { $percent }%
max-credit-available = ရနိုင်သည့် အမြင့်ဆုံးအမှတ်: { $percent }%
attempts-remaining =
    { $count ->
        [0] ကြိုးစားခွင့် မကျန်တော့ပါ
       *[other] ကြိုးစားခွင့် { $count } ကြိမ် ကျန်သည်
    }
validation-correct = (မှန်)
validation-incorrect = (မှား)
validation-partially-correct = (တစ်စိတ်တစ်ပိုင်း မှန်)
answer-show-responses =
    { $count ->
       *[other] { $answerId } ၏ အဖြေ { $count } ခုကို ပြရန်
    }

## Disclosure panels

feedback-heading = တုံ့ပြန်ချက်
collapsible-click-to-open = (ဖွင့်ရန် နှိပ်ပါ)
collapsible-click-to-close = (ပိတ်ရန် နှိပ်ပါ)
collapsible-initializing = စတင်နေသည်...
footnote-show = အောက်ခြေမှတ်စု ပြရန်
footnote-hide = အောက်ခြေမှတ်စု ဖျောက်ရန်
description-more-information = နောက်ထပ်အချက်အလက်

## Controls

slider-previous = ယခင်
slider-next = နောက်
keyboard-open = ကီးဘုတ် ဖွင့်ရန်
keyboard-close = ကီးဘုတ် ပိတ်ရန်
choice-input-remove-choice = { $choice } ဖယ်ရန်
matrix-remove-row = အတန်း ဖယ်ရန်
matrix-add-row = အတန်း ထည့်ရန်
matrix-remove-column = ကော်လံ ဖယ်ရန်
matrix-add-column = ကော်လံ ထည့်ရန်
subset-add-remove-points = အမှတ် ထည့်ရန်/ဖယ်ရန်
subset-toggle-points-intervals = အမှတ်နှင့် ကြားကာလ အပြန်အလှန်ပြောင်းရန်
subset-move-points = အမှတ်များ ရွှေ့ရန်
subset-clear = ရှင်းလင်းရန်
# A `box` here is one orbital, drawn as a square: အကွက်.
orbital-add-row = အတန်း ထည့်ရန်
orbital-remove-row = အတန်း ဖယ်ရန်
orbital-add-box = အကွက် ထည့်ရန်
orbital-remove-box = အကွက် ဖယ်ရန်
orbital-add-up-arrow = အထက်မြှား ထည့်ရန်
orbital-add-down-arrow = အောက်မြှား ထည့်ရန်
orbital-remove-arrow = မြှား ဖယ်ရန်
orbital-row-label = အတန်း { $row } ၏ အညွှန်း
pretzel-answer = အဖြေ

## Math input

math-input-preview-region = သင်္ချာဖော်ပြချက် အစမ်းကြည့်ရှုမှု
math-input-preview = အစမ်းကြည့်ရှုမှု
math-input-invalid-expression = မမှန်ကန်သော ဖော်ပြချက်:

## Document status

viewer-initializing = စတင်နေသည်...

## Errors

error-heading = အမှား
error-found-at =
    { $span ->
        [line] စာကြောင်း { $startLine } တွင် တွေ့ရသည်။
       *[lines] စာကြောင်း { $startLine }–{ $endLine } တွင် တွေ့ရသည်။
    }
document-contains-errors = ဤစာတမ်းတွင် အမှားများ ပါဝင်သည်!
diagnostic-heading-error = အမှား
diagnostic-heading-warning = သတိပေးချက်
diagnostic-heading-information = အချက်အလက်
diagnostic-heading-hint = အရိပ်အမြွက်
accessibility-heading-level-1 = WCAG AA အသုံးပြုနိုင်စွမ်း ချိုးဖောက်မှု
accessibility-heading-level-2 = အသုံးပြုနိုင်စွမ်း သတိပေးချက်
something-went-wrong = တစ်ခုခု မှားသွားသည်။
renderer-load-failed = ရန်ဒါရာတစ်ခု မတင်နိုင်ပါ။ စာမျက်နှာကို ပြန်တင်ပါ။
core-start-failed = စာတမ်းကြည့်ရှုစနစ်ကို မစတင်နိုင်ပါ။ စာမျက်နှာကို ပြန်တင်ပါ။
