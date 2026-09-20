# Kashmiri viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Right-to-left, written in logical order; see `content.ftl`'s header, and the
# note there on the gender agreement this seed does not attempt.


## Answer submission

answer-checking = پرٛژھان…
answer-submitting = بیٖجان…
answer-checking-status = جواب پرٛژھان
answer-submitting-status = جواب بیٖجان
answer-correct = دُرُست
answer-incorrect = غلط
answer-response-saved = جواب محفوظ کۆرمُت
answer-percent-credit = { $percent }% نمبر
answer-percent-correct = { $percent }% دُرُست
answer-percent-short = { $percent } %
max-credit-available = زیادٕ کھۄتہٕ زیادٕ نمبر: { $percent }%
attempts-remaining =
    { $count ->
        [0] کہٕنٛہہ کوشِش چھُ نہٕ باقی
        [one] { $count } کوشِش باقی
       *[other] { $count } کوشِشہٕ باقی
    }
validation-correct = (دُرُست)
validation-incorrect = (غلط)
validation-partially-correct = (حِصٕ داری دُرُست)
answer-show-responses =
    { $count ->
        [one] { $answerId } خٲطرٕ { $count } جواب ہٲوِو
       *[other] { $answerId } خٲطرٕ { $count } جواب ہٲوِو
    }

## Disclosure panels

feedback-heading = رٲے
collapsible-click-to-open = (کھولنہٕ خٲطرٕ کلِک کرِو)
collapsible-click-to-close = (بند کرنہٕ خٲطرٕ کلِک کرِو)
collapsible-initializing = شُروٗع گژھان…
footnote-show = پادنوٹ ہٲوِو
footnote-hide = پادنوٹ ژھوپٲوِو
description-more-information = زیادٕ معلوٗمات

## Controls

slider-previous = پَتٕم
slider-next = بۆنٕم
keyboard-open = کیٖبورڈ کھولِو
keyboard-close = کیٖبورڈ بند کرِو
choice-input-remove-choice = { $choice } کڈِو
matrix-remove-row = قطار کڈِو
matrix-add-row = قطار شٲمِل کرِو
matrix-remove-column = ستوٗن کڈِو
matrix-add-column = ستوٗن شٲمِل کرِو
subset-add-remove-points = نُختہٕ شٲمِل کرِو/کڈِو
subset-toggle-points-intervals = نُختہٕ تہٕ وقفہٕ بدلٲوِو
subset-move-points = نُختہٕ پکنٲوِو
subset-clear = مٹٲوِو
orbital-add-row = قطار شٲمِل کرِو
orbital-remove-row = قطار کڈِو
orbital-add-box = ڈبہٕ شٲمِل کرِو
orbital-remove-box = ڈبہٕ کڈِو
orbital-add-up-arrow = ہیورٕ تیٖر شٲمِل کرِو
orbital-add-down-arrow = بۆنہٕ تیٖر شٲمِل کرِو
orbital-remove-arrow = تیٖر کڈِو
orbital-row-label = قطار { $row } ہٕنٛد لیبل
pretzel-answer = جواب

## Math input

math-input-preview-region = ریاضی اِظہارُک پؠش نظارٕ
math-input-preview = پؠش نظارٕ
math-input-invalid-expression = غلط اِظہار:

## Document status

viewer-initializing = شُروٗع گژھان…

## Errors

error-heading = غلطی
error-found-at =
    { $span ->
        [line] لَکیٖر { $startLine } پؠٹھ لبنہٕ آو۔
       *[lines] لَکیٖر { $startLine }–{ $endLine } پؠٹھ لبنہٕ آو۔
    }
document-contains-errors = یَتھ دستاویزس منٛز چھِ غلطی!
diagnostic-heading-error = غلطی
diagnostic-heading-warning = تَنبیٖہ
diagnostic-heading-information = معلوٗمات
diagnostic-heading-hint = اِشارٕ
accessibility-heading-level-1 = WCAG AA رسٲیی خِلاف ورزی
accessibility-heading-level-2 = رسٲیی اِطلاع
something-went-wrong = کینٛہہ غلط سپُد۔
renderer-load-failed = اَکھ ہاوَن وول لوڈ نہٕ سپُد۔ مہربٲنی کرِتھ صفحہٕ دۄبارٕ لوڈ کرِو۔
core-start-failed = دستاویز ہاوَن وول شُروٗع نہٕ سپُد۔ مہربٲنی کرِتھ صفحہٕ دۄبارٕ لوڈ کرِو۔
