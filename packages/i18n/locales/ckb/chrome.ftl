# Central Kurdish (Sorani) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Kurdo-Arabic alphabet — the fully vowelled Arabic-script
# orthography of the Kurdistan Region of Iraq, which is what its schools and
# its publishing use and what CLDR gives `ckb`. `ckb` maximizes to
# `ckb-Arab-IQ`, so `directionOf` reports it **right to left**.
#
# Northern Kurdish (Kurmanji) has a catalog of its own, `locales/kmr`, written
# left to right in the Latin alphabet. A Sorani reader reaches this file
# instead: `ckb` is a member of the `ku` macrolanguage, and the roster folds
# only `sdh` onto Kurmanji — `ckb` is deliberately left out of that fold, the
# same exclusion `locales/mnk` makes for `bam` and `dyu`. Because Sorani ships
# beside it, the Kurmanji catalog is named `kmr` rather than `ku`; the
# macrolanguage tag still reaches it, through `LANGUAGE_ALIASES`.
#
# Two plural categories, `one` and `other`. A Sorani noun after a numeral
# stays singular, so almost nothing needs the branch; a message wanting a
# separate wording for none says `[0]` by number, as the English does.
#
# Sorani has no grammatical gender — it lost the masculine/feminine
# distinction Kurmanji keeps — so nothing here agrees and `noun-gender` in
# `content.ftl` answers with one token for everything.
#
# Numbers reach the reader in Latin digits, which is the repository-wide
# policy under "Digits are Latin, separators are not" in the README. A Sorani
# reader would ordinarily expect ٠١٢٣; they are not written anywhere in these
# four files, and no message names a numbering system.
#
# Register: a control is named by a verbal noun («زیادکردنی ڕیز», never
# «ڕیزێک زیاد بکە»), and a sentence addressed to the reader takes the
# imperative singular, which is what Kurdish interfaces use.


## Answer submission

answer-checking = پشکنین...
answer-submitting = ناردن...
answer-checking-status = پشکنینی وەڵام
answer-submitting-status = ناردنی وەڵام
answer-correct = ڕاست
answer-incorrect = هەڵە
answer-response-saved = وەڵام پاشەکەوت کرا
answer-percent-credit = { $percent }% لە نمرە
answer-percent-correct = { $percent }% ڕاست
answer-percent-short = { $percent }%
max-credit-available = بەرزترین نمرەی بەردەست: { $percent }%
attempts-remaining =
    { $count ->
        [0] هیچ هەوڵێک نەماوە
       *[other] { $count } هەوڵ ماوە
    }
validation-correct = (ڕاست)
validation-incorrect = (هەڵە)
validation-partially-correct = (بەشێکی ڕاستە)
answer-show-responses = پیشاندانی { $count } وەڵامی نێردراو بۆ { $answerId }

## Disclosure panels

feedback-heading = وەڵامدانەوە
collapsible-click-to-open = (بۆ کردنەوە کلیک بکە)
collapsible-click-to-close = (بۆ داخستن کلیک بکە)
collapsible-initializing = ئامادەکردن...
footnote-show = پیشاندانی پەراوێز
footnote-hide = شاردنەوەی پەراوێز
description-more-information = زانیاری زیاتر

## Controls

slider-previous = پێشوو
slider-next = دواتر
keyboard-open = کردنەوەی تەختەکلیل
keyboard-close = داخستنی تەختەکلیل
choice-input-remove-choice = لابردنی { $choice }
matrix-remove-row = لابردنی ڕیز
matrix-add-row = زیادکردنی ڕیز
matrix-remove-column = لابردنی ستوون
matrix-add-column = زیادکردنی ستوون
subset-add-remove-points = زیادکردن/لابردنی خاڵ
subset-toggle-points-intervals = گۆڕین لە نێوان خاڵ و ماوەدا
subset-move-points = جوڵاندنی خاڵەکان
subset-clear = سڕینەوە
orbital-add-row = زیادکردنی ڕیز
orbital-remove-row = لابردنی ڕیز
orbital-add-box = زیادکردنی خانە
orbital-remove-box = لابردنی خانە
orbital-add-up-arrow = زیادکردنی تیری سەرەوە
orbital-add-down-arrow = زیادکردنی تیری خوارەوە
orbital-remove-arrow = لابردنی تیر
orbital-row-label = ناونیشانی ڕیزی { $row }
pretzel-answer = وەڵام
# «ستوون» names what `$column` is, so that the ezafe joining the phrase to it
# falls on a word this catalog writes rather than on the placeable.

## Math input

math-input-preview-region = پێشبینینی دەربڕینی بیرکاری
math-input-preview = پێشبینین
math-input-invalid-expression = دەربڕینی نادروست:

## Document status

viewer-initializing = ئامادەکردن...

## Errors

error-heading = هەڵە
error-found-at =
    { $span ->
        [line] لە دێڕی { $startLine } دۆزرایەوە.
       *[lines] لە دێڕەکانی { $startLine } تا { $endLine } دۆزرایەوە.
    }
document-contains-errors = ئەم دۆکیومێنتە هەڵەی تێدایە!
# Headings of the tooltip the editor shows over a squiggle.
diagnostic-heading-error = هەڵە
diagnostic-heading-warning = ئاگاداری
diagnostic-heading-information = زانیاری
diagnostic-heading-hint = ڕێنوێنی
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = پێشێلکردنی دەستڕاگەیشتن بەپێی WCAG AA
accessibility-heading-level-2 = ئاگاداری دەستڕاگەیشتن
something-went-wrong = شتێک هەڵە بوو.
# Follows `error-heading` and a colon.
renderer-load-failed = یەکێک لە پێکهاتەکان بار نەبوو. تکایە پەڕەکە دووبارە بار بکەرەوە.
core-start-failed = نەتوانرا ئەم دۆکیومێنتە دەست پێ بکات. تکایە پەڕەکە دووبارە بار بکەرەوە.
core-start-failed-busy = نەتوانرا ئەم دۆکیومێنتە دەست پێ بکات. چەند دۆکیومێنتێک لە یەک کاتدا دەستیان پێ دەکرد، ئەمەش لەسەر ئامێرێکی خاوتر کاتی زیاتر دەبات. دوای تەواوبوونی ئەوانی تر، دووبارە بارکردنەوەی پەڕەکە لەوانەیە یارمەتی بدات.
core-start-failed-retry = نەتوانرا ئەم دۆکیومێنتە دەست پێ بکات.
core-start-failed-busy-retry = نەتوانرا ئەم دۆکیومێنتە دەست پێ بکات. چەند دۆکیومێنتێک لە یەک کاتدا دەستیان پێ دەکرد، ئەمەش لەسەر ئامێرێکی خاوتر کاتی زیاتر دەبات.
core-start-retry = دووبارە هەوڵ بدەرەوە
saved-state-unavailable = کاری پاشەکەوتکراوت بار نەکرا.
