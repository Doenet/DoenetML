# Sindhi viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Sentences end in «۔», Sindhi's own full stop.
#
# Register: the polite plural throughout, which is what Sindhi interfaces use
# and the only form that is safe not knowing who is being addressed.
#
# Sindhi counts in two categories, and `other` covers zero as well as
# everything above one, so a message wanting a separate wording for none says
# `[0]` by number, as the English does — Fluent matches an explicit number
# before it consults the plural rules. Unlike Urdu, a Sindhi noun after a
# numeral takes the plural, so a counted noun needs the `one` branch wherever
# its plural is spelled differently.


## Answer submission

answer-checking = جانچجي رهيو آهي...
answer-submitting = موڪليو پيو وڃي...
answer-checking-status = جواب جانچجي رهيو آهي
answer-submitting-status = جواب موڪليو پيو وڃي
answer-correct = صحيح
answer-incorrect = غلط
answer-response-saved = جواب محفوظ ٿي ويو
answer-percent-credit = { $percent }% نمبر
answer-percent-correct = { $percent }% صحيح
answer-percent-short = { $percent }%
max-credit-available = وڌ ۾ وڌ ممڪن نمبر: { $percent }%
attempts-remaining =
    { $count ->
        [0] ڪا به ڪوشش باقي ناهي
        [one] { $count } ڪوشش باقي
       *[other] { $count } ڪوششون باقي
    }
validation-correct = (صحيح جواب)
validation-incorrect = (غلط جواب)
validation-partially-correct = (جزوي طور تي صحيح جواب)
# «جواب» is spelled alike in the singular and the plural, so this one needs no
# branch — unlike `attempts-remaining` above, whose «ڪوشش» pluralizes to
# «ڪوششون».
answer-show-responses = { $answerId } ڏانهن موڪليل { $count } جواب ڏيکاريو

## Disclosure panels

feedback-heading = راءِ
collapsible-click-to-open = (کولڻ لاءِ ڪلڪ ڪريو)
collapsible-click-to-close = (بند ڪرڻ لاءِ ڪلڪ ڪريو)
collapsible-initializing = تيار ٿي رهيو آهي...
footnote-show = پاد نوٽ ڏيکاريو
footnote-hide = پاد نوٽ لڪايو
description-more-information = وڌيڪ ڄاڻ

## Controls

slider-previous = پويون
slider-next = ايندڙ
keyboard-open = ڪي بورڊ کوليو
keyboard-close = ڪي بورڊ بند ڪريو
choice-input-remove-choice = { $choice } هٽايو
matrix-remove-row = قطار هٽايو
matrix-add-row = قطار شامل ڪريو
matrix-remove-column = ڪالم هٽايو
matrix-add-column = ڪالم شامل ڪريو
subset-add-remove-points = نقطا شامل ڪريو/هٽايو
subset-toggle-points-intervals = نقطن ۽ وقفن جي وچ ۾ مٽايو
subset-move-points = نقطا هلايو
subset-clear = صاف ڪريو
orbital-add-row = قطار شامل ڪريو
orbital-remove-row = قطار هٽايو
orbital-add-box = خانو شامل ڪريو
orbital-remove-box = خانو هٽايو
orbital-add-up-arrow = مٿي وارو تير شامل ڪريو
orbital-add-down-arrow = هيٺ وارو تير شامل ڪريو
orbital-remove-arrow = تير هٽايو
orbital-row-label = قطار { $row } جو نالو
pretzel-answer = جواب

## Math input

math-input-preview-region = رياضياتي جملي جو اڳ نظارو
math-input-preview = اڳ نظارو
math-input-invalid-expression = نامعتبر جملو:

## Document status

viewer-initializing = تيار ٿي رهيو آهي...

## Errors

error-heading = خرابي
error-found-at =
    { $span ->
        [line] سٽ { $startLine } تي ملي۔
       *[lines] سٽ { $startLine } کان { $endLine } تائين ملي۔
    }
document-contains-errors = هن دستاويز ۾ خرابيون آهن!
# Headings of the tooltip the editor shows over a squiggle.
diagnostic-heading-error = خرابي
diagnostic-heading-warning = خبردار
diagnostic-heading-information = ڄاڻ
diagnostic-heading-hint = اشارو
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = WCAG AA موجب رسائي جي ڀڃڪڙي
accessibility-heading-level-2 = رسائي بابت خبردار
something-went-wrong = ڪجهه غلط ٿي ويو۔
# Follows `error-heading` and a colon.
renderer-load-failed = هڪ جزو لوڊ نه ٿي سگهيو۔ مهرباني ڪري صفحو ٻيهر لوڊ ڪريو۔
core-start-failed = دستاويز جو ناظر شروع نه ٿي سگهيو۔ مهرباني ڪري صفحو ٻيهر لوڊ ڪريو۔
