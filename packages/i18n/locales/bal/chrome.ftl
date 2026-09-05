# Balochi (بلوچی) viewer chrome: the buttons, panel headings and status words
# the reader interacts with. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Which Balochi.** `bal` is the ISO 639-3 macrolanguage over Eastern (`bgp`),
# Southern (`bcc` — Iranian Makrani and Rakhshani) and Western (`bgn`) Balochi.
# This catalog follows the **Southern Balochi written in Pakistan**, the
# register of the Karachi and Quetta publishing tradition, which is the variety
# with the largest body of printed prose and the one most Balochi schooling in
# Pakistan is conducted around.
#
# **Script and orthography: Perso-Arabic, right to left, on the Urdu letter
# inventory.** The retroflexes are written `ٹ ڈ ڑ`, final *ē* is written `ے`,
# and `ہ` rather than `ه`. The Iranian Balochi convention — which writes the
# retroflexes as plain `ت د ر` and uses the Persian finals — is a different
# orthography, not a variant spelling, and a corrector should convert all four
# files of this locale at once rather than mix the two. Nothing about the file
# format changes for a right-to-left catalog: the text is written in logical
# order and no direction marks are placed by hand. Digits are Latin, which is
# the repository-wide policy and what keeps a sentence and the mathematics
# beside it counting in the same characters.
#
# **Plurals — and `bal` is the one tag in its batch with real CLDR data.**
# `new Intl.PluralRules("bal").resolvedOptions().locale` is `"bal"`, and the
# categories it actually gives are exactly **`one` and `other`**, with **zero
# falling in `other`** — unlike Persian, whose rule counts zero with the
# singular. So a `[few]` or `[many]` branch would still be unreachable here,
# and nothing in these four files writes one. What this catalog *also* does not
# write is a `[one]` branch, and that is a fact about Balochi rather than about
# CLDR: a Balochi noun after a numeral stays unmarked, so the two categories
# would carry identical text. Every count message is therefore a single
# `*[other]`. `[0]` is kept where English has it — Fluent matches a numeric
# literal against the number itself before it consults any plural rule, so that
# branch is reachable whatever the locale, and here it has to be, because zero
# does not fall in a category of its own.
#
# **Register.** A control is named with the verbal noun in `-اگ` — «ٹُگ ءِ
# لڑکاری» style compounding is avoided — and a short instruction to the reader
# is the singular imperative. `ءَ` is the object marker and is written as the
# separate letter Balochi prints it as, never joined to the word before it.
#
# **Loans kept rather than replaced by coinages.** Balochi shares its
# mathematical, chemical and computing vocabulary with Urdu and Persian, and
# that is the vocabulary a Balochi-speaking pupil actually meets: `کی بورڈ`,
# `میٹرکس`, `شماریات`, `فیصد`, `آربیٹل`, `WCAG` and the geometry words in
# `content.ftl` are kept in that shape rather than replaced with new words.


## Answer submission

answer-checking = چک کنگ ءَ اِنت...
answer-submitting = روان کنگ ءَ اِنت...
answer-checking-status = جواب ءِ چک کنگ
answer-submitting-status = جواب ءِ روان کنگ
answer-correct = راست
answer-incorrect = غلط
answer-response-saved = جواب سنبھ بوت
answer-percent-credit = { $percent }% نمرہ
answer-percent-correct = { $percent }% راست
answer-percent-short = { $percent } %
max-credit-available = گیشترین نمرہ: { $percent }%
attempts-remaining =
    { $count ->
        [0] ہچ کوشست نہ ماننت
       *[other] { $count } کوشست مانَگ ءَ اِنت
    }
validation-correct = (راست)
validation-incorrect = (غلط)
validation-partially-correct = (بہرے راست)
# «ءِ» links the count to the answer's authored name and stands as a separate
# letter, so nothing is joined to the placeable.
answer-show-responses = { $answerId } ءِ { $count } جواب پیش داریت

## Disclosure panels

feedback-heading = رد ءُ بند
collapsible-click-to-open = (پچ کنگ ءِ واستہ کلک کن)
collapsible-click-to-close = (بند کنگ ءِ واستہ کلک کن)
collapsible-initializing = سرا کنگ ءَ اِنت...
footnote-show = زیرنوٹ ءَ پیش دار
footnote-hide = زیرنوٹ ءَ چیر کن
description-more-information = گیشتریں معلومات

## Controls

slider-previous = پیسری
slider-next = رندی
keyboard-open = کی بورڈ ءَ پچ کن
keyboard-close = کی بورڈ ءَ بند کن
choice-input-remove-choice = { $choice } ءَ در کن
matrix-remove-row = رج ءَ در کن
matrix-add-row = رج ءَ ھور کن
matrix-remove-column = ستون ءَ در کن
matrix-add-column = ستون ءَ ھور کن
subset-add-remove-points = نقطہ ھور کنگ/در کنگ
subset-toggle-points-intervals = نقطہ ءُ وقفہ ءِ نیام ءَ گردینگ
subset-move-points = نقطہ ءَ لڑینگ
subset-clear = پاک کنگ
orbital-add-row = رج ءَ ھور کن
orbital-remove-row = رج ءَ در کن
orbital-add-box = خانہ ءَ ھور کن
orbital-remove-box = خانہ ءَ در کن
orbital-add-up-arrow = برزی تیر ءَ ھور کن
orbital-add-down-arrow = چیری تیر ءَ ھور کن
orbital-remove-arrow = تیر ءَ در کن
orbital-row-label = رج { $row } ءِ نام
pretzel-answer = جواب
# «ستون» names what `$column` is, so the phrase does not have to attach
# anything to the placeable.

## Math input

math-input-preview-region = ریاضی ءِ عبارت ءِ پیش دیدگ
math-input-preview = پیش دیدگ
math-input-invalid-expression = غلطیں عبارت:

## Document status

viewer-initializing = سرا کنگ ءَ اِنت...

## Errors

error-heading = خطا
error-found-at =
    { $span ->
        [line] لینک { $startLine } ءَ کپت.
       *[lines] لینک { $startLine }–{ $endLine } ءَ کپت.
    }
document-contains-errors = ای دستاویز ءَ خطا ھست!
diagnostic-heading-error = خطا
diagnostic-heading-warning = ھشدار
diagnostic-heading-information = معلومات
diagnostic-heading-hint = رہشون
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = رسیدگی ءِ خلاف ورزی: WCAG AA
accessibility-heading-level-2 = رسیدگی ءِ ھشدار
something-went-wrong = چیزے غلط بوت.
renderer-load-failed = رینڈرر ے بار نہ بوت. مہربانی کن ءُ صفحہ ءَ پدا بار کن.
core-start-failed = ای دستاویز سرا نہ بوت. مہربانی کن ءُ صفحہ ءَ پدا بار کن.
core-start-failed-busy = ای دستاویز سرا نہ بوت. مزنیں تعداد ءِ دستاویز یک وھد ءَ سرا بوتگ اَنت، ءُ ھمے چیز سستیں دستگاہ ءِ سرا گیشتریں وھد ءَ گِپت کنت. دگہ دستاویزاں چه سرا بیت ءَ رند، صفحہ ءِ پدا بار کنگ مدت کنت.
core-start-failed-retry = ای دستاویز سرا نہ بوت.
core-start-failed-busy-retry = ای دستاویز سرا نہ بوت. مزنیں تعداد ءِ دستاویز یک وھد ءَ سرا بوتگ اَنت، ءُ ھمے چیز سستیں دستگاہ ءِ سرا گیشتریں وھد ءَ گِپت کنت.
core-start-retry = پدا کوشست کن
saved-state-unavailable = تئی سنبھ بوتگیں کار بار نہ بوت.
