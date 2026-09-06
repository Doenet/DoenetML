# Gilaki (گیلکی) viewer chrome: the buttons, panel headings and status words a
# reader touches. Translated from `locales/en/chrome.ftl`, which is the source
# of truth: `lint:i18n` rejects a key that does not exist there, and reports a
# key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Gilaki is written in the Perso-Arabic script, right to left.
# The Gilaki Wikipedia marks the vowels Persian does not have with two extra
# letters — «ؤ» for /o/ and «ۊ» for /u/, as in «خؤب» and «بۊشؤ». **This seed
# does not use them.** They cannot be applied evenly across some fifteen
# hundred technical messages without guessing at the vowel of every borrowed
# term, and a convention applied to half a catalog is worse than one not
# applied at all. Everything here is written with the plain Persian letters
# «و», «ا» and «ی», so «سورخ» rather than «سۊرخ». A corrector who wants the
# Wikipedia convention should convert **all four files at once** rather than
# leave the two systems mixed inside one catalog.
# (One caveat, so nobody "fixes" it: «ؤ» also occurs inside the Persian
# loanwords «مؤلفه» and «مؤلفه‌ان», where it is the ordinary Arabic hamza
# carrier of the standard Persian spelling, not the Gilaki /o/ letter. Those
# stay as they are.)
#
# **What is Gilaki here and what is not.** Be blunt about this. Gilaki has no
# register of its own for «ویژگی», «مؤلفه», «کنتراست» or «چندضلعی» — a Gilaki
# speaker does mathematics, chemistry and computing in Persian, and inventing
# Gilaki equivalents would produce words no reader has ever seen. So the
# content vocabulary of this catalog is Persian, on purpose. What is Gilaki,
# and is Gilaki without exception, is the grammar carrying it:
#
#   * the copula — «ایسه» for *is* and «نیه» for *is not*, never «است» or
#     «نیست»;
#   * the plural suffix «-ان» — «نقطه‌ان», «سطران» — never Persian «-ها»;
#   * counting with the classifier «تا» and a **singular** noun: «{ $count } تا
#     تلاش», never a plural after a numeral;
#   * the verbs: «کودن» for *do* and its compounds, «واکودن» to open, «دوستن»
#     to close, «بوستن» to become, «دان» to give, «بامو» for *came*, and the
#     negative prefix «ن-» («نوبوسته»);
#   * the postpositions «مئن» (*in*) and «ره» (*to*, marking an object), which
#     put the phrase together back to front from the Persian;
#   * a handful of everyday words — «ای» (this), «ویشتر» (more), «وخت» (time).
#
# A reviewer should expect to be **rewriting sentences, not correcting typos**.
#
# **Counting.** `Intl.PluralRules` has no data for `glk`, so nothing but
# `[one]` and `*[other]` could ever be selected — and since Gilaki leaves the
# noun singular after a numeral, even that distinction has nothing to mark.
# Every count select is therefore collapsed to a single `*[other]`. An explicit
# numeric branch like `[0]` is matched against the number itself rather than
# through the plural rules, so English's `[0]` branches are kept.


## Answer submission

answer-checking = بررسی کودن دره...
answer-submitting = ارسال کودن دره...
answer-checking-status = پاسخ بررسی کودن دره
answer-submitting-status = پاسخ ارسال کودن دره
answer-correct = درست
answer-incorrect = نادرست
answer-response-saved = پاسخ ذخیره بوبو
answer-percent-credit = { $percent }% نمره
answer-percent-correct = { $percent }% درست
answer-percent-short = { $percent }%
max-credit-available = ویشترین نمره کی شا گیتن: { $percent }%
# «تا» is the classifier and the noun after it stays singular, which is why
# there is one branch here rather than two. `[0]` is kept: Fluent matches it
# against the number itself, not through the plural rules.
attempts-remaining =
    { $count ->
        [0] هیچ تلاش باقی نمانسته
       *[other] { $count } تا تلاش باقی مانسته
    }
validation-correct = (درست)
validation-incorrect = (نادرست)
validation-partially-correct = (نیمه‌درست)
# «ره» marks what the responses were sent to, and comes after `$answerId`
# rather than before it — the postposition is written into the message, never
# onto the placeable.
answer-show-responses = { $answerId } ره { $count } تا پاسخ نشان دان

## Disclosure panels

feedback-heading = بازخورد
collapsible-click-to-open = (واکودن ره کلیک بکونید)
collapsible-click-to-close = (دوستن ره کلیک بکونید)
collapsible-initializing = آماده بوستن دره...
footnote-show = پانویس نشان دان
footnote-hide = پانویس پنهان کودن
description-more-information = ویشتر اطلاعات

## Controls

slider-previous = قبلی
slider-next = بعدی
keyboard-open = صفحه‌کلید واکودن
keyboard-close = صفحه‌کلید دوستن
# The object precedes the verb, so nothing has to be attached to `$choice`.
choice-input-remove-choice = { $choice } ره حذف کودن
matrix-remove-row = سطر حذف کودن
matrix-add-row = سطر اضافه کودن
matrix-remove-column = ستون حذف کودن
matrix-add-column = ستون اضافه کودن
subset-add-remove-points = نقطه اضافه کودن/حذف کودن
subset-toggle-points-intervals = نقطه‌ان و بازه‌ان میان عوض کودن
subset-move-points = نقطه‌ان جابه‌جا کودن
subset-clear = پاک کودن
orbital-add-row = سطر اضافه کودن
orbital-remove-row = سطر حذف کودن
orbital-add-box = خانه اضافه کودن
orbital-remove-box = خانه حذف کودن
orbital-add-up-arrow = جور پیکان اضافه کودن
orbital-add-down-arrow = جیر پیکان اضافه کودن
orbital-remove-arrow = پیکان حذف کودن
orbital-row-label = سطر { $row } برچسب
pretzel-answer = پاسخ
# Gilaki puts the possessor first, so `$column` leads and the word naming it
# follows: nothing is welded onto the placeable and a reviewer can lift it out
# whole.

## Math input

math-input-preview-region = ریاضی عبارت پیش‌نمایش
math-input-preview = پیش‌نمایش
math-input-invalid-expression = نامعتبر عبارت:

## Document status

viewer-initializing = آماده بوستن دره...

## Errors

error-heading = خطا
# «مئن» is the Gilaki postposition for *in* and follows the line number.
error-found-at =
    { $span ->
        [line] سطر { $startLine } مئن پیدا بوبو.
       *[lines] سطر { $startLine } تا { $endLine } مئن پیدا بوبو.
    }
document-contains-errors = ای سند خطا دنه!
diagnostic-heading-error = خطا
diagnostic-heading-warning = هشدار
diagnostic-heading-information = اطلاعات
diagnostic-heading-hint = راهنمایی
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = WCAG AA دسترس‌پذیری نقض
accessibility-heading-level-2 = دسترس‌پذیری هشدار
something-went-wrong = ایتا مشکل پیش بامو.
renderer-load-failed = ایتا نمایش‌دهنده بار نوبوسته. لطفاً صفحه ره دوباره بار بکونید.
core-start-failed = ای سند شروع نوبوسته. لطفاً صفحه ره دوباره بار بکونید.
core-start-failed-busy = ای سند شروع نوبوسته. چند تا سند ایتا وخت شروع بوستان دبید، کی سست‌تر دستگاه مئن ویشتر طول کشنه. وقتی اون سندان تمام ببید، صفحه ره دوباره بار کودن شاید کومک بکونه.
core-start-failed-retry = ای سند شروع نوبوسته.
core-start-failed-busy-retry = ای سند شروع نوبوسته. چند تا سند ایتا وخت شروع بوستان دبید، کی سست‌تر دستگاه مئن ویشتر طول کشنه.
core-start-retry = دوباره امتحان کودن
saved-state-unavailable = شمه ذخیره‌بوبو کار بار نوبوسته.
