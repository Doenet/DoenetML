# Saraiki (سرائیکی) viewer chrome: the buttons, panel headings and status
# words the reader interacts with. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and direction: Perso-Arabic, right to left.** Saraiki's alphabet is
# Urdu's — `ٹ ڈ ڑ` for the retroflexes, `ے` for final *ē*, `ہ` rather than
# `ه` — plus the four implosives that are the language's signature:
# **ٻ ڄ ڋ ڳ**. They are written here wherever the word has one, so «اڳلا» is
# *next* with ڳ and «ڋکھاؤ» is *show* with the implosive *ḍ*. The implosive *ḍ*
# is encoded **U+068B ڋ** throughout; Saraiki text also circulates with
# U+0759 (dal with two dots vertically below and small tah), which renders
# almost identically and compares unequal, so a corrector converting to that
# convention must convert all four files of this locale at once rather than
# mix the two. The retroflex nasal is written **ݨ** (U+0768) — «کرݨ»,
# «کھولݨ» — which is Saraiki's letter and not Urdu's, and is used here
# wherever the word has one. `directionOf` learns `skr` from
# `src/direction.ts`'s fallback list, since ICU does not maximize the tag to a
# script on its own.
#
# Nothing about the file format changes for a right-to-left catalog. The text
# is written in **logical order** — the order it is spoken — and no bidi
# control characters are placed by hand: Fluent's own isolation puts the marks
# around an interpolated value, and `dir` decides where each run is drawn.
# Brackets and parentheses are written opening-first and the bidi algorithm
# turns them around at render time.
#
# **Digits are Latin.** `{ $percent }`, `{ $count }` and `{ $row }` render as
# `0`–`9` here as everywhere else in the repository, which is what keeps a
# Saraiki sentence and the mathematics beside it counting in the same
# characters. The separator is not pinned; only the ten characters are.
#
# **No plural categories.** CLDR has no plural data for `skr`, so nothing here
# selects on a category and `lint:i18n` would reject one if it did. That costs
# nothing: a Saraiki noun after a numeral stays unmarked, so one form counts
# everything. `[0]` is kept where English has it — Fluent matches a numeric
# literal against the number itself before it consults any plural rule, so
# that branch is reachable whatever the locale.
#
# **Register.** The polite plural imperative in `-و` («کرو», «ڋکھاؤ»,
# «کھولو»), which is what a Saraiki interface would use and the only form that
# is safe not knowing who is being addressed. Sentences end in «۔» and separate
# with «،».
#
# **Loans kept rather than coined.** Saraiki-medium schooling stops well short
# of mathematics and computing, so the technical vocabulary here is the Urdu
# one a Saraiki-speaking pupil actually meets — `کی بورڈ`, `میٹرکس`, `کالم`,
# `شماریاتی`, `فیصد`, `آربیٹل`, `WCAG` — written in Saraiki spelling rather
# than replaced with new words.


## Answer submission

answer-checking = پرکھ تھیندی پئی اے...
answer-submitting = گھلی ویندی پئی اے...
answer-checking-status = جواب پرکھیا ویندا پئے
answer-submitting-status = جواب گھلیا ویندا پئے
answer-correct = ٹھیک
answer-incorrect = غلط
answer-response-saved = جواب محفوظ تھی ڳیا
answer-percent-credit = { $percent }% نمبر
answer-percent-correct = { $percent }% ٹھیک
answer-percent-short = { $percent } %
max-credit-available = ودھ توں ودھ نمبر: { $percent }%
attempts-remaining =
    { $count ->
        [0] کوئی کوشش باقی کائنی
       *[other] { $count } کوششاں باقی ہن
    }
validation-correct = (ٹھیک)
validation-incorrect = (غلط)
validation-partially-correct = (جزوی طور تے ٹھیک)
# «دے» is a postposition and stands as its own word, so nothing is joined to
# the placeable.
answer-show-responses = { $answerId } دے { $count } جواب ڋکھاؤ

## Disclosure panels

feedback-heading = رائے
collapsible-click-to-open = (کھولݨ کیتے کلک کرو)
collapsible-click-to-close = (بند کرݨ کیتے کلک کرو)
collapsible-initializing = تیار تھیندا پئے...
footnote-show = حاشیہ ڋکھاؤ
footnote-hide = حاشیہ لکاؤ
description-more-information = ودھیک معلومات

## Controls

slider-previous = پچھلا
slider-next = اڳلا
keyboard-open = کی بورڈ کھولو
keyboard-close = کی بورڈ بند کرو
choice-input-remove-choice = { $choice } ہٹاؤ
matrix-remove-row = قطار ہٹاؤ
matrix-add-row = قطار شامل کرو
matrix-remove-column = کالم ہٹاؤ
matrix-add-column = کالم شامل کرو
subset-add-remove-points = نقطے شامل کرو/ہٹاؤ
subset-toggle-points-intervals = نقطیاں تے وقفیاں وچ بدلو
subset-move-points = نقطے ہلاؤ
subset-clear = صاف کرو
orbital-add-row = قطار شامل کرو
orbital-remove-row = قطار ہٹاؤ
orbital-add-box = خانہ شامل کرو
orbital-remove-box = خانہ ہٹاؤ
orbital-add-up-arrow = اُتلا تیر شامل کرو
orbital-add-down-arrow = ہیٹھلا تیر شامل کرو
orbital-remove-arrow = تیر ہٹاؤ
orbital-row-label = قطار { $row } دا عنوان
pretzel-answer = جواب
# «کالم» names what `$column` is, so the genitive falls on a word this catalog
# writes rather than on the value.

## Math input

math-input-preview-region = ریاضی دے اظہار دا پیش نظارہ
math-input-preview = پیش نظارہ
math-input-invalid-expression = غلط اظہار:

## Document status

viewer-initializing = تیار تھیندا پئے...

## Errors

error-heading = خرابی
error-found-at =
    { $span ->
        [line] سطر { $startLine } تے ملی۔
       *[lines] سطر { $startLine }–{ $endLine } تے ملی۔
    }
document-contains-errors = ایں دستاویز وچ خرابیاں ہن!
diagnostic-heading-error = خرابی
diagnostic-heading-warning = تنبیہ
diagnostic-heading-information = معلومات
diagnostic-heading-hint = اشارہ
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = رسائی دی خلاف ورزی: WCAG AA
accessibility-heading-level-2 = رسائی دی تنبیہ
something-went-wrong = کجھ غلط تھی ڳیا۔
renderer-load-failed = ہک رینڈرر لوڈ نہ تھی سڳیا۔ مہربانی کر کے صفحہ ولدا لوڈ کرو۔
core-start-failed = ایہ دستاویز شروع نہ تھی سڳی۔ مہربانی کر کے صفحہ ولدا لوڈ کرو۔
core-start-failed-busy = ایہ دستاویز شروع نہ تھی سڳی۔ کئی دستاویزاں ہکو ویلھے شروع تھیندیاں پئیاں ہن، تے ہیں ڳالھ نوں سست ڈیوائس تے ودھیک ویلا لڳدا اے۔ ٻیاں دستاویزاں دے مکݨ توں بعد صفحہ ولدا لوڈ کرݨ نال فائدہ تھی سڳدا اے۔
core-start-failed-retry = ایہ دستاویز شروع نہ تھی سڳی۔
core-start-failed-busy-retry = ایہ دستاویز شروع نہ تھی سڳی۔ کئی دستاویزاں ہکو ویلھے شروع تھیندیاں پئیاں ہن، تے ہیں ڳالھ نوں سست ڈیوائس تے ودھیک ویلا لڳدا اے۔
core-start-retry = ولدا کوشش کرو
saved-state-unavailable = تہاڋا محفوظ تھیا ہویا کم لوڈ نہ تھی سڳیا۔
