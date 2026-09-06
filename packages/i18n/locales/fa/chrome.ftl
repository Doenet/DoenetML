# Persian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: a control is named by a verbal noun («افزودن سطر», never «سطر اضافه
# کنید»), and a sentence addressed to the reader takes the polite plural, which
# is what Persian interfaces use and the only one of the two that is safe not
# knowing who is being addressed.
#
# Persian has two plural categories, and `one` covers zero as well as one, so a
# message wanting a separate wording for none says `[0]` by number, as the
# English does — Fluent matches an explicit number before it consults the
# plural rules. Elsewhere the count needs no branch at all: a Persian noun
# after a number stays singular, so one form counts everything.


## Answer submission

answer-checking = در حال بررسی...
answer-submitting = در حال ارسال...
answer-checking-status = در حال بررسی پاسخ
answer-submitting-status = در حال ارسال پاسخ
answer-correct = درست
answer-incorrect = نادرست
answer-response-saved = پاسخ ذخیره شد
answer-percent-credit = { $percent }% از نمره
answer-percent-correct = { $percent }% درست
answer-percent-short = { $percent }%
max-credit-available = بیشترین نمرهٔ ممکن: { $percent }%
attempts-remaining =
    { $count ->
        [0] تلاشی باقی نمانده است
       *[other] { $count } تلاش باقی مانده است
    }
validation-correct = (پاسخ درست)
validation-incorrect = (پاسخ نادرست)
validation-partially-correct = (پاسخ تا حدی درست)
answer-show-responses = نمایش { $count } پاسخ ارسال‌شده به { $answerId }

## Disclosure panels

feedback-heading = بازخورد
collapsible-click-to-open = (برای باز کردن کلیک کنید)
collapsible-click-to-close = (برای بستن کلیک کنید)
collapsible-initializing = در حال آماده‌سازی...
footnote-show = نمایش پانویس
footnote-hide = پنهان کردن پانویس
description-more-information = اطلاعات بیشتر

## Controls

slider-previous = قبلی
slider-next = بعدی
keyboard-open = باز کردن صفحه‌کلید
keyboard-close = بستن صفحه‌کلید
choice-input-remove-choice = حذف { $choice }
matrix-remove-row = حذف سطر
matrix-add-row = افزودن سطر
matrix-remove-column = حذف ستون
matrix-add-column = افزودن ستون
subset-add-remove-points = افزودن/حذف نقطه
subset-toggle-points-intervals = تغییر میان نقطه‌ها و بازه‌ها
subset-move-points = جابه‌جایی نقطه‌ها
subset-clear = پاک کردن
orbital-add-row = افزودن سطر
orbital-remove-row = حذف سطر
orbital-add-box = افزودن خانه
orbital-remove-box = حذف خانه
orbital-add-up-arrow = افزودن پیکان رو به بالا
orbital-add-down-arrow = افزودن پیکان رو به پایین
orbital-remove-arrow = حذف پیکان
orbital-row-label = برچسب سطر { $row }
pretzel-answer = پاسخ
# «ستون» names what `$column` is, so that the ezāfe joining the phrase to it
# does not have to be written onto a placeable.

## Math input

math-input-preview-region = پیش‌نمایش عبارت ریاضی
math-input-preview = پیش‌نمایش
math-input-invalid-expression = عبارت نامعتبر:

## Document status

viewer-initializing = در حال آماده‌سازی...

## Errors

error-heading = خطا
error-found-at =
    { $span ->
        [line] در سطر { $startLine } یافت شد.
       *[lines] در سطرهای { $startLine } تا { $endLine } یافت شد.
    }
document-contains-errors = این سند خطا دارد!
# Headings of the tooltip the editor shows over a squiggle.
diagnostic-heading-error = خطا
diagnostic-heading-warning = هشدار
diagnostic-heading-information = اطلاعات
diagnostic-heading-hint = راهنمایی
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = نقض دسترس‌پذیری بر پایهٔ WCAG AA
accessibility-heading-level-2 = هشدار دسترس‌پذیری
something-went-wrong = مشکلی پیش آمد.
# Follows `error-heading` and a colon.
renderer-load-failed = بارگذاری یکی از مؤلفه‌ها ناموفق بود. لطفاً صفحه را دوباره بارگذاری کنید.
core-start-failed = راه‌اندازی نمایشگر سند ناموفق بود. لطفاً صفحه را دوباره بارگذاری کنید.
