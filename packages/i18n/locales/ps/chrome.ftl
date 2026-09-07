# Pashto viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Sentences end in «۔», Pashto's own full stop.
#
# Register: the polite plural throughout, which is what Pashto interfaces use
# and the only form that is safe not knowing who is being addressed.
#
# Pashto counts in two categories, and `other` covers zero as well as
# everything above one, so a message wanting a separate wording for none says
# `[0]` by number, as the English does — Fluent matches an explicit number
# before it consults the plural rules. Unlike Persian, Urdu and Uyghur, a
# Pashto noun after a numeral takes the plural, so a counted noun does need the
# `one` branch.


## Answer submission

answer-checking = کتنه روانه ده...
answer-submitting = لېږل روان دي...
answer-checking-status = ځواب کتل کیږي
answer-submitting-status = ځواب لېږل کیږي
answer-correct = سم
answer-incorrect = ناسم
answer-response-saved = ځواب خوندي شو
answer-percent-credit = { $percent }% نمرې
answer-percent-correct = { $percent }% سم
answer-percent-short = { $percent }%
max-credit-available = تر ټولو لوړه ممکنه نمره: { $percent }%
attempts-remaining =
    { $count ->
        [0] هېڅ هڅه نه ده پاتې
        [one] { $count } هڅه پاتې ده
       *[other] { $count } هڅې پاتې دي
    }
validation-correct = (سم ځواب)
validation-incorrect = (ناسم ځواب)
validation-partially-correct = (جزوي سم ځواب)
answer-show-responses =
    { $count ->
        [one] { $answerId } ته لېږل شوی { $count } ځواب وښایاست
       *[other] { $answerId } ته لېږل شوي { $count } ځوابونه وښایاست
    }

## Disclosure panels

feedback-heading = نظر
collapsible-click-to-open = (د پرانیستلو لپاره کلیک وکړئ)
collapsible-click-to-close = (د تړلو لپاره کلیک وکړئ)
collapsible-initializing = چمتو کیږي...
footnote-show = پښتوونه وښایاست
footnote-hide = پښتوونه پټه کړئ
description-more-information = نور معلومات

## Controls

slider-previous = پخوانی
slider-next = راتلونکی
keyboard-open = کیبورډ پرانیزئ
keyboard-close = کیبورډ وتړئ
choice-input-remove-choice = { $choice } لرې کړئ
matrix-remove-row = کتار لرې کړئ
matrix-add-row = کتار زیات کړئ
matrix-remove-column = ستون لرې کړئ
matrix-add-column = ستون زیات کړئ
subset-add-remove-points = ټکي زیات/لرې کړئ
subset-toggle-points-intervals = د ټکو او وقفو ترمنځ بدلون
subset-move-points = ټکي وخوځوئ
subset-clear = پاک کړئ
orbital-add-row = کتار زیات کړئ
orbital-remove-row = کتار لرې کړئ
orbital-add-box = خانه زیاته کړئ
orbital-remove-box = خانه لرې کړئ
orbital-add-up-arrow = پورته غشی زیات کړئ
orbital-add-down-arrow = ښکته غشی زیات کړئ
orbital-remove-arrow = غشی لرې کړئ
orbital-row-label = د کتار { $row } نوم
pretzel-answer = ځواب

## Math input

math-input-preview-region = د ریاضي عبارت مخکتنه
math-input-preview = مخکتنه
math-input-invalid-expression = ناسم عبارت:

## Document status

viewer-initializing = چمتو کیږي...

## Errors

error-heading = تېروتنه
error-found-at =
    { $span ->
        [line] په کرښه { $startLine } کې وموندل شوه۔
       *[lines] په کرښو { $startLine } تر { $endLine } کې وموندل شوه۔
    }
document-contains-errors = په دې سند کې تېروتنې شته!
# Headings of the tooltip the editor shows over a squiggle.
diagnostic-heading-error = تېروتنه
diagnostic-heading-warning = خبرداری
diagnostic-heading-information = معلومات
diagnostic-heading-hint = اشاره
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = د WCAG AA له مخې د لاسرسي سرغړونه
accessibility-heading-level-2 = د لاسرسي خبرتیا
something-went-wrong = یو څه ناسم شول۔
# Follows `error-heading` and a colon.
renderer-load-failed = یوه برخه بار نه شوه۔ مهرباني وکړئ مخ بیا بار کړئ۔
core-start-failed = د سند لیدونکی پیل نه شو۔ مهرباني وکړئ مخ بیا بار کړئ۔
