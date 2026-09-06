# Northern Luri (لری شمالی) viewer chrome: the buttons, panel headings and
# status words the reader interacts with. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Northern Luri is written in the Perso-Arabic script, right
# to left. The Luri Wikipedia writes «ؤ» for /o/ and «ۊ» for /u/, which is why
# the language calls itself «لۊری شومالی» there. **These files do not use those
# two letters.** The convention cannot be applied reliably across fifteen
# hundred technical messages without a speaker checking every vowel, and a
# half-applied convention is worse than none: «سۊر» beside «سور» in the same
# catalog tells a reader the file is unedited rather than that the vowel is
# long. So everything here is written with plain Persian letters — و, ا, ی —
# and «سور», not «سۊر». A corrector who prefers the Wikipedia orthography
# should convert **all four files at once** rather than mix the two systems
# inside one catalog, and should convert the endonym in these headers with
# them.
#
# One caveat about that rule: «ؤ» also occurs inside ordinary Persian
# loanwords spelled the Persian way — «مؤلفه» throughout these files — where
# it is a hamza on a wāw and not the Luri /o/ vowel. Those are not
# violations of the decision above, and should be left alone.
#
# **What is Luri here and what is not.** Outside the copula, the plural, the
# way things are counted, and a handful of everyday words, the vocabulary in
# this file is **Persian**. That is not laziness: Luri speakers do school,
# mathematics and computing in Persian, and there is no Luri register for
# «مؤلفه», «ویژگی» or «کنتراست» to reach for. What is consistently Luri:
#
#   * the copula — «هه» for *is* and «نیه» for *is not*, never Persian «است»
#     or «نیست»;
#   * the plural suffix **«-یل»** — «خطیل», «نقطه‌یل», «مؤلفه‌یل» — never
#     Persian «-ها» or «-ان»;
#   * counting: a numeral takes the classifier «تا» and leaves the noun
#     **singular** — «3 تا نقطه», «{ $count } تا تلاش» — so nothing after a
#     number is ever pluralized;
#   * a few ordinary words that are Luri rather than Persian, such as «منده»
#     (*remains*) in `attempts-remaining`.
#
# Luri is head-initial, like Persian: a modifier follows its noun and is joined
# by the ezafe. So the **shape** of these messages is close to `locales/fa`'s
# on purpose — the difference between this catalog and Persian is morphological
# far more than it is syntactic. A reviewer should expect to be **rewriting
# sentences**, not correcting typos.
#
# **Counting and plural categories.** `Intl.PluralRules` has no data for `lrc`,
# so a `[one]` branch could never be selected by the language's own rules —
# and Luri would not want one anyway, since the noun after a numeral stays
# singular. Every count select here is therefore collapsed to a single
# `*[other]`. An explicit numeric branch like `[0]` is matched against the
# number itself rather than against a plural category, so those are kept, as
# the English has them.
#
# Numbers reach the reader in Latin digits, which is the repository-wide policy
# under "Digits are Latin, separators are not" in the README.


## Answer submission

answer-checking = در حال بررسی...
answer-submitting = در حال ارسال...
answer-checking-status = در حال بررسی پاسخ
answer-submitting-status = در حال ارسال پاسخ
answer-correct = درست
answer-incorrect = نادرست
answer-response-saved = پاسخ ذخیره وابی
answer-percent-credit = { $percent }% از نمره
answer-percent-correct = { $percent }% درست
answer-percent-short = { $percent }%
max-credit-available = بیشترین نمرهٔ ممکن: { $percent }%
# «منده» — *remains* — is Luri, against Persian «مانده است». The count takes
# the classifier «تا» and leaves «تلاش» singular, so one branch counts
# everything; `[0]` is matched by number, not by plural rule, so it stays.
attempts-remaining =
    { $count ->
        [0] هیچ تلاشی نمنده
       *[other] { $count } تا تلاش منده
    }
validation-correct = (پاسخ درست)
validation-incorrect = (پاسخ نادرست)
validation-partially-correct = (پاسخ تا حدی درست)
answer-show-responses = نمایش { $count } تا پاسخ سی { $answerId }


## Disclosure panels

feedback-heading = بازخورد
collapsible-click-to-open = (سی وا کردن کلیک کنین)
collapsible-click-to-close = (سی بستن کلیک کنین)
collapsible-initializing = در حال آماده‌سازی...
footnote-show = نمایش پانویس
footnote-hide = پنهون کردن پانویس
description-more-information = اطلاعات بیشتر


## Controls

slider-previous = پیشین
slider-next = پسین
keyboard-open = وا کردن صفحه‌کلید
keyboard-close = بستن صفحه‌کلید
choice-input-remove-choice = حذف { $choice }
matrix-remove-row = حذف سطر
matrix-add-row = افزودن سطر
matrix-remove-column = حذف ستون
matrix-add-column = افزودن ستون
subset-add-remove-points = افزودن/حذف نقطه
subset-toggle-points-intervals = جابه‌جایی میان نقطه‌یل و بازه‌یل
subset-move-points = جابه‌جا کردن نقطه‌یل
subset-clear = پاک کردن
orbital-add-row = افزودن سطر
orbital-remove-row = حذف سطر
orbital-add-box = افزودن خانه
orbital-remove-box = حذف خانه
orbital-add-up-arrow = افزودن پیکان رو به بالا
orbital-add-down-arrow = افزودن پیکان رو به هار
orbital-remove-arrow = حذف پیکان
orbital-row-label = برچسب سطر { $row }
pretzel-answer = پاسخ
# «ستون» names what `$column` is, so the ezafe joining the phrase to it falls
# on a word this message spells out rather than onto the placeable.


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
        [line] در سطر { $startLine } پیدا وابی.
       *[lines] در سطریل { $startLine } تا { $endLine } پیدا وابی.
    }
document-contains-errors = ای سند خطا دارۀ!
# Headings of the tooltip the editor shows over a squiggle.
diagnostic-heading-error = خطا
diagnostic-heading-warning = هشدار
diagnostic-heading-information = اطلاعات
diagnostic-heading-hint = راهنمایی
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = نقض دسترس‌پذیری بر پایهٔ WCAG AA
accessibility-heading-level-2 = هشدار دسترس‌پذیری
something-went-wrong = یه چی درست پیش نره.
renderer-load-failed = بارگذاری یکی از مؤلفه‌یل ناموفق بی. لطفاً صفحه ره دووارته بارگذاری کنین.
core-start-failed = راه‌اندازی ای سند ممکن نبی. لطفاً صفحه ره دووارته بارگذاری کنین.
core-start-failed-busy = راه‌اندازی ای سند ممکن نبی. چند تا سند با هم دارن راه می‌افتن، و ای کار سر دستگاه کندتر بیشتر طول کشه. وختی سندیل دیگه تموم وابین، بارگذاری دووارتهٔ صفحه شاید کمک کنه.
core-start-failed-retry = راه‌اندازی ای سند ممکن نبی.
core-start-failed-busy-retry = راه‌اندازی ای سند ممکن نبی. چند تا سند با هم دارن راه می‌افتن، و ای کار سر دستگاه کندتر بیشتر طول کشه.
core-start-retry = دووارته امتحان کنین
saved-state-unavailable = کاری که ذخیره وابیه بارگذاری نبی.
