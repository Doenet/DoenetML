# Mazanderani (مازِرونی) viewer chrome: the buttons, panel headings and status
# words the reader touches. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Plain Perso-Arabic letters, the ordinary Persian alphabet and
# nothing beyond it. This file does **not** use the extra vowel letters that
# Gilaki and Luri writers have adopted — no «ؤ», no «ۊ» — and it does not
# vocalise: a fatḥe or kasre appears only in the few words that are unreadable
# without one («سِرخ», «سِوز», «اِسپه»). Mazanderani has no single agreed
# orthography, and a corrector who wants a fuller vocalisation is welcome to
# it, but should convert **all four files at once** rather than leave half the
# catalog pointed and half of it bare.
#
# **What is Mazanderani here and what is not.** Be honest about this before
# reading further: outside of five things, the vocabulary below is Persian.
# The five are the copula («هسه» / «نیه», never «است» / «نیست»), the plural
# suffix «-ون» rather than «-ها», the numeral classifier «تا» with a singular
# noun after it, the head-final word order, and a short list of everyday words
# — the colours «سیو», «اِسپه», «سِرخ», «سِوز» among them. Everything else —
# «مؤلفه», «ویژگی», «دسترس‌پذیری», «نمایشگر», «کنتراست» — is the Persian word,
# because Persian is the language Mazanderani speakers do school, mathematics
# and computing in, and there is no Mazanderani register for any of it. A
# reviewer should expect to be **rewriting sentences, not correcting typos**.
#
# **Counting.** `Intl.PluralRules` has no data for `mzn`, so only `one` and
# `other` could ever be selected here and a `few`/`many` branch would be dead
# text. It does not matter: Mazanderani counts with the classifier «تا» and a
# **singular** noun — «3 تا تلاش», never «3 تا تلاشون» — so one wording counts
# everything and every count select is collapsed to a single `*[other]`. The
# `[0]` branch of `attempts-remaining` stays, because Fluent matches an
# explicit number against the number itself before it consults any plural rule.


## Answer submission

answer-checking = دَره وارسی بونه...
answer-submitting = دَره اِرسال بونه...
answer-checking-status = جواب دَره وارسی بونه
answer-submitting-status = جواب دَره اِرسال بونه
answer-correct = دِرِست
answer-incorrect = نادرست
answer-response-saved = جواب ذخیره بیّه
answer-percent-credit = { $percent }% نمره
answer-percent-correct = { $percent }% دِرِست
answer-percent-short = { $percent } %
max-credit-available = بیشترین نمره‌ای که بَیته بونه: { $percent }%
attempts-remaining =
    { $count ->
        [0] هیچ تلاشی نموندسته
       *[other] { $count } تا تلاش هنتا موندسته
    }
validation-correct = (دِرِست)
validation-incorrect = (نادرست)
validation-partially-correct = (بخشی دِرِست)
# «تا» with a singular «جواب» counts them; `$answerId` is the answer's authored
# name and is not translated.
answer-show-responses = { $count } تا جواب که { $answerId } ره هدائه بیّه، نشون هاده


## Disclosure panels

feedback-heading = بازخورد
collapsible-click-to-open = (وا هاکردن سِری کلیک هاکنین)
collapsible-click-to-close = (دَوِستن سِری کلیک هاکنین)
collapsible-initializing = دَره آماده بونه...
footnote-show = پانویس ره نشون هاده
footnote-hide = پانویس ره قایم هاکن
description-more-information = بیشتر اطلاعات


## Controls

slider-previous = قبلی
slider-next = بعدی
keyboard-open = صفحه‌کلید ره وا هاکن
keyboard-close = صفحه‌کلید ره دَوِند
choice-input-remove-choice = { $choice } ره وردار
matrix-remove-row = سطر ره وردار
matrix-add-row = سطر هارِسون
matrix-remove-column = ستون ره وردار
matrix-add-column = ستون هارِسون
subset-add-remove-points = نقطه هارِسون/ورداشتن
subset-toggle-points-intervals = نقطه‌ون و بازه‌ون میون جابه‌جا بوندن
subset-move-points = نقطه‌ون ره بَکِش
subset-clear = پاک هاکن
orbital-add-row = سطر هارِسون
orbital-remove-row = سطر ره وردار
orbital-add-box = خنه هارِسون
orbital-remove-box = خنه ره وردار
orbital-add-up-arrow = بالا پیکان هارِسون
orbital-add-down-arrow = جیر پیکان هارِسون
orbital-remove-arrow = پیکان ره وردار
orbital-row-label = { $row } سطرِ برچسب
pretzel-answer = جواب
# «ستون» names what `$column` is, so the phrase can be built around the
# placeable without anything being attached to it.


## Math input

math-input-preview-region = ریاضی عبارتِ پیش‌نمایش
math-input-preview = پیش‌نمایش
math-input-invalid-expression = نامعتبر عبارت:


## Document status

viewer-initializing = دَره آماده بونه...


## Errors

error-heading = خطا
error-found-at =
    { $span ->
        [line] { $startLine } سطر دله پیدا بیّه.
       *[lines] { $startLine } تا { $endLine } سطرون دله پیدا بیّه.
    }
document-contains-errors = این سند خطا دارنه!
diagnostic-heading-error = خطا
diagnostic-heading-warning = هشدار
diagnostic-heading-information = اطلاعات
diagnostic-heading-hint = راهنمایی
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = WCAG AA بر پایه دسترس‌پذیری نقض
accessibility-heading-level-2 = دسترس‌پذیری هشدار
something-went-wrong = یه چی دِرِست پیش نیّمو.
renderer-load-failed = یکی از مؤلفه‌ون بار نیّه. لطفاً صفحه ره دِواره بار هاکنین.
core-start-failed = این سند راه دَکِته نَیّه. لطفاً صفحه ره دِواره بار هاکنین.
core-start-failed-busy = این سند راه دَکِته نَیّه. چن تا سند یه‌جا دَره راه دَکِتنه، که کِند دستگاه سر بیشتر طول کَشِنه. وقتی اون سندون تموم بَیّنه، صفحه ره دِواره بار هاکردن شاید کمک هاکنه.
core-start-failed-retry = این سند راه دَکِته نَیّه.
core-start-failed-busy-retry = این سند راه دَکِته نَیّه. چن تا سند یه‌جا دَره راه دَکِتنه، که کِند دستگاه سر بیشتر طول کَشِنه.
core-start-retry = دِواره امتحان هاکن
saved-state-unavailable = شِمه ذخیره‌بَیی کار بار نیّه.
