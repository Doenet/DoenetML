# Urdu viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: the polite plural throughout, which is what Urdu interfaces use and
# the only form that is safe not knowing who is being addressed.
#
# Urdu counts in two categories, and `other` covers zero as well as everything
# above one, so a message wanting a separate wording for none says `[0]` by
# number, as the English does — Fluent matches an explicit number before it
# consults the plural rules. Elsewhere the count needs no branch: an Urdu noun
# after a numeral does not change, so one form counts everything.
#
# Sentences end in «۔», Urdu's own full stop.


## Answer submission

answer-checking = جانچا جا رہا ہے...
answer-submitting = بھیجا جا رہا ہے...
answer-checking-status = جواب جانچا جا رہا ہے
answer-submitting-status = جواب بھیجا جا رہا ہے
answer-correct = صحیح
answer-incorrect = غلط
answer-response-saved = جواب محفوظ ہو گیا
answer-percent-credit = { $percent }% نمبر
answer-percent-correct = { $percent }% صحیح
answer-percent-short = { $percent }%
max-credit-available = زیادہ سے زیادہ ممکنہ نمبر: { $percent }%
attempts-remaining =
    { $count ->
        [0] کوئی کوشش باقی نہیں
       *[other] { $count } کوشش باقی
    }
validation-correct = (صحیح جواب)
validation-incorrect = (غلط جواب)
validation-partially-correct = (جزوی طور پر صحیح جواب)
answer-show-responses = { $answerId } کو بھیجے گئے { $count } جواب دکھائیں

## Disclosure panels

feedback-heading = رائے
collapsible-click-to-open = (کھولنے کے لیے کلک کریں)
collapsible-click-to-close = (بند کرنے کے لیے کلک کریں)
collapsible-initializing = تیار کیا جا رہا ہے...
footnote-show = حاشیہ دکھائیں
footnote-hide = حاشیہ چھپائیں
description-more-information = مزید معلومات

## Controls

slider-previous = پچھلا
slider-next = اگلا
keyboard-open = کی بورڈ کھولیں
keyboard-close = کی بورڈ بند کریں
choice-input-remove-choice = { $choice } ہٹائیں
matrix-remove-row = سطر ہٹائیں
matrix-add-row = سطر شامل کریں
matrix-remove-column = کالم ہٹائیں
matrix-add-column = کالم شامل کریں
subset-add-remove-points = نقطے شامل کریں/ہٹائیں
subset-toggle-points-intervals = نقطوں اور وقفوں کے درمیان بدلیں
subset-move-points = نقطے حرکت دیں
subset-clear = صاف کریں
orbital-add-row = سطر شامل کریں
orbital-remove-row = سطر ہٹائیں
orbital-add-box = خانہ شامل کریں
orbital-remove-box = خانہ ہٹائیں
orbital-add-up-arrow = اوپر کا تیر شامل کریں
orbital-add-down-arrow = نیچے کا تیر شامل کریں
orbital-remove-arrow = تیر ہٹائیں
orbital-row-label = سطر { $row } کا عنوان
pretzel-answer = جواب

## Math input

math-input-preview-region = ریاضیاتی اظہار کا پیش نظارہ
math-input-preview = پیش نظارہ
math-input-invalid-expression = نامعتبر اظہار:

## Document status

viewer-initializing = تیار کیا جا رہا ہے...

## Errors

error-heading = خرابی
error-found-at =
    { $span ->
        [line] سطر { $startLine } پر ملی۔
       *[lines] سطر { $startLine } تا { $endLine } پر ملی۔
    }
document-contains-errors = اس دستاویز میں خرابیاں ہیں!
# Headings of the tooltip the editor shows over a squiggle.
diagnostic-heading-error = خرابی
diagnostic-heading-warning = تنبیہ
diagnostic-heading-information = معلومات
diagnostic-heading-hint = اشارہ
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = WCAG AA کے مطابق رسائی کی خلاف ورزی
accessibility-heading-level-2 = رسائی سے متعلق تنبیہ
something-went-wrong = کچھ غلط ہو گیا۔
# Follows `error-heading` and a colon.
renderer-load-failed = ایک جزو لوڈ نہیں ہو سکا۔ براہِ کرم صفحہ دوبارہ لوڈ کریں۔
core-start-failed = دستاویز کا ناظر شروع نہیں ہو سکا۔ براہِ کرم صفحہ دوبارہ لوڈ کریں۔
