# Hazaragi (هزارگی / آزرگی) viewer chrome: the buttons, panel headings and
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
# **CLDR has no name for this tag at all.** `haz` is a valid ISO 639-3 code and
# `Intl.DisplayNames` returns nothing for it, so the roster's label for this
# catalog is written by hand rather than read out of CLDR. The gap is in the
# names only: likely-subtags does know the tag, and `haz` maximizes to
# `haz-Arab-AF`, which is what settles this catalog's direction. That is a fact
# about the data, not about the language: Hazaragi is spoken by several million
# people in the Hazarajat and in the Quetta and Mashhad diasporas.
#
# **Script and orthography: Perso-Arabic, right to left, following Kabul Dari.**
# Hazaragi is a variety of Persian and is rarely written; what written Hazaragi
# exists is spelled with Dari conventions, and that is what these four files
# do. So `ی` and `ک` in their Persian shapes, `ه` word-finally, and the Persian
# `هٔ` for the ezafe after a vowel. No Urdu letters, and **no attempt to write
# Hazaragi phonology into the spelling** — the vowel system differs from
# Kabul's, but there is no accepted way of showing that in print and inventing
# one here would make the file unreadable to the people who can check it.
# Digits are Latin, which is the repository-wide policy; a Dari reader would
# expect ٠١٢٣ in print, and none is written here.
#
# **What is actually Hazaragi in these files, and what is Dari.** Most of what
# a message catalog says — *check*, *submit*, *row*, *column*, *error* — is
# vocabulary Hazaragi shares with Dari word for word, and the honest thing is
# to write the Dari word rather than to manufacture a difference. **A Dari word
# here is not an oversight.** Where Hazaragi does differ in something this
# catalog needs, it is used and flagged: **«قد» for *with*** (Dari «با»), and
# **«بلدِ» for *for*** (Dari «برای»). Hazaragi's larger differences from Dari —
# the verb system, and a stratum of Turkic and Mongolic vocabulary — barely
# touch this subject matter, which is why so little of it shows here. That
# thinness is a property of the domain, not a gap in the seed.
#
# **Plurals.** `Intl.PluralRules` has no data for `haz`; it resolves to the
# runtime default, so a category branch written here would be selected by
# English's rules rather than by Hazaragi's. Hazaragi, like Persian, leaves a
# noun unmarked after a numeral, so the branches would be identical anyway:
# every count message is written once as `*[other]`. `[0]` is kept where
# English has it, because Fluent matches a numeric literal against the number
# itself before it consults any plural rule and that branch is reachable in
# any locale.
#
# **Register.** A control is named by a verbal noun («سطر علاوه کدو», never an
# imperative), and a sentence addressed to the reader takes the polite plural,
# which is the only choice that is safe not knowing who is being addressed.
#
# **Loans kept:** `کیبورد`, `ماتریس`, `احصائیه`, `اوربیتال`, `فیصد`, `WCAG` —
# the words Dari schooling and Afghan computing actually use.


## Answer submission

answer-checking = چک شده استه...
answer-submitting = روان شده استه...
answer-checking-status = چک کدونِ جواب
answer-submitting-status = روان کدونِ جواب
answer-correct = درست
answer-incorrect = نادرست
answer-response-saved = جواب ذخیره شد
answer-percent-credit = { $percent }% نمره
answer-percent-correct = { $percent }% درست
answer-percent-short = { $percent } %
max-credit-available = کلانترین نمره: { $percent }%
attempts-remaining =
    { $count ->
        [0] هیچ کوشش باقی نمانده
       *[other] { $count } کوشش باقی مانده
    }
validation-correct = (درست)
validation-incorrect = (نادرست)
validation-partially-correct = (یک اندازه درست)
# The ezafe joining the count to the answer's authored name is unwritten after
# a consonant, so the space carries it and nothing is attached to the
# placeable.
answer-show-responses = نشان دادونِ { $count } جواب بلدِ { $answerId }

## Disclosure panels

feedback-heading = نظر
collapsible-click-to-open = (بلدِ باز کدو کلیک کنین)
collapsible-click-to-close = (بلدِ بسته کدو کلیک کنین)
collapsible-initializing = شروع شده استه...
footnote-show = نشان دادونِ پاورقی
footnote-hide = پنهان کدونِ پاورقی
description-more-information = معلومات زیادتر

## Controls

slider-previous = پیشتر
slider-next = بعدی
keyboard-open = باز کدونِ کیبورد
keyboard-close = بسته کدونِ کیبورد
choice-input-remove-choice = دور کدونِ { $choice }
matrix-remove-row = دور کدونِ سطر
matrix-add-row = علاوه کدونِ سطر
matrix-remove-column = دور کدونِ ستون
matrix-add-column = علاوه کدونِ ستون
subset-add-remove-points = علاوه/دور کدونِ نقطه
subset-toggle-points-intervals = گشتاندو بین نقطه‌ها و وقفه‌ها
subset-move-points = جابجا کدونِ نقطه‌ها
subset-clear = پاک کدو
orbital-add-row = علاوه کدونِ سطر
orbital-remove-row = دور کدونِ سطر
orbital-add-box = علاوه کدونِ خانه
orbital-remove-box = دور کدونِ خانه
orbital-add-up-arrow = علاوه کدونِ تیرِ بالا
orbital-add-down-arrow = علاوه کدونِ تیرِ پایین
orbital-remove-arrow = دور کدونِ تیر
orbital-row-label = نامِ سطر { $row }
pretzel-answer = جواب
# «ستون» names what `$column` is, so that the ezafe does not have to be
# written onto a placeable.

## Math input

math-input-preview-region = پیش‌نمایشِ عبارتِ ریاضی
math-input-preview = پیش‌نمایش
math-input-invalid-expression = عبارتِ نادرست:

## Document status

viewer-initializing = شروع شده استه...

## Errors

error-heading = خطا
error-found-at =
    { $span ->
        [line] در سطر { $startLine } پیدا شد.
       *[lines] در سطرهای { $startLine }–{ $endLine } پیدا شد.
    }
document-contains-errors = ای سند خطا داره!
diagnostic-heading-error = خطا
diagnostic-heading-warning = هشدار
diagnostic-heading-information = معلومات
diagnostic-heading-hint = رهنمایی
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = تخطی از دسترس‌پذیری: WCAG AA
accessibility-heading-level-2 = هشدارِ دسترس‌پذیری
something-went-wrong = یک چیز خطا شد.
renderer-load-failed = یک رندرر بار نشد. لطفاً صفحه ره دوباره بار کنین.
core-start-failed = ای سند شروع نشد. لطفاً صفحه ره دوباره بار کنین.
core-start-failed-busy = ای سند شروع نشد. چند سند در یک وقت شروع شده بود، و ای کار در یک دستگاهِ سست وقتِ زیادتر می‌گیره. وقتی سندهای دیگه تمام شد، دوباره بار کدونِ صفحه شاید کمک کنه.
core-start-failed-retry = ای سند شروع نشد.
core-start-failed-busy-retry = ای سند شروع نشد. چند سند در یک وقت شروع شده بود، و ای کار در یک دستگاهِ سست وقتِ زیادتر می‌گیره.
core-start-retry = دوباره کوشش کنین
saved-state-unavailable = کارِ ذخیره‌شدهٔ شما بار نشد.
