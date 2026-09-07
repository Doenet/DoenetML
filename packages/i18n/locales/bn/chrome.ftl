# Bangla viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the -উন imperative Bangla puts on a button — কীবোর্ড খুলুন —
# which is the আপনি form and is what a reader expects from software.
#
# A counted noun is not pluralized in Bangla, so both plural branches read the
# same wherever the noun is the only thing that would have changed.


## Answer submission

answer-checking = যাচাই করা হচ্ছে...
answer-submitting = পাঠানো হচ্ছে...
answer-checking-status = উত্তর যাচাই করা হচ্ছে
answer-submitting-status = উত্তর পাঠানো হচ্ছে
answer-correct = সঠিক
answer-incorrect = ভুল
answer-response-saved = উত্তর সংরক্ষিত হয়েছে
answer-percent-credit = { $percent }% নম্বর
answer-percent-correct = { $percent }% সঠিক
answer-percent-short = { $percent }%
max-credit-available = সর্বোচ্চ সম্ভাব্য নম্বর: { $percent }%
attempts-remaining =
    { $count ->
        [0] কোনো প্রচেষ্টা বাকি নেই
        [one] { $count }টি প্রচেষ্টা বাকি
       *[other] { $count }টি প্রচেষ্টা বাকি
    }
validation-correct = (সঠিক)
validation-incorrect = (ভুল)
validation-partially-correct = (আংশিক সঠিক)
answer-show-responses =
    { $count ->
        [one] { $answerId }-এর { $count }টি উত্তর দেখান
       *[other] { $answerId }-এর { $count }টি উত্তর দেখান
    }

## Disclosure panels

feedback-heading = প্রতিক্রিয়া
collapsible-click-to-open = (খুলতে ক্লিক করুন)
collapsible-click-to-close = (বন্ধ করতে ক্লিক করুন)
collapsible-initializing = শুরু করা হচ্ছে...
footnote-show = পাদটীকা দেখান
footnote-hide = পাদটীকা লুকান
description-more-information = আরও তথ্য

## Controls

slider-previous = পূর্ববর্তী
slider-next = পরবর্তী
keyboard-open = কীবোর্ড খুলুন
keyboard-close = কীবোর্ড বন্ধ করুন
choice-input-remove-choice = { $choice } সরান
matrix-remove-row = সারি সরান
matrix-add-row = সারি যোগ করুন
matrix-remove-column = কলাম সরান
matrix-add-column = কলাম যোগ করুন
subset-add-remove-points = বিন্দু যোগ/অপসারণ
subset-toggle-points-intervals = বিন্দু ও ব্যবধির মধ্যে পাল্টান
subset-move-points = বিন্দু সরান
subset-clear = পরিষ্কার করুন
# A `box` here is one orbital, drawn as a square: ঘর.
orbital-add-row = সারি যোগ করুন
orbital-remove-row = সারি সরান
orbital-add-box = ঘর যোগ করুন
orbital-remove-box = ঘর সরান
orbital-add-up-arrow = ঊর্ধ্বমুখী তির যোগ করুন
orbital-add-down-arrow = নিম্নমুখী তির যোগ করুন
orbital-remove-arrow = তির সরান
orbital-row-label = { $row } নং সারির লেবেল
pretzel-answer = উত্তর

## Math input

math-input-preview-region = গাণিতিক রাশির পূর্বরূপ
math-input-preview = পূর্বরূপ
math-input-invalid-expression = অবৈধ রাশি:

## Document status

viewer-initializing = শুরু করা হচ্ছে...

## Errors

error-heading = ত্রুটি
error-found-at =
    { $span ->
        [line] { $startLine } নং লাইনে পাওয়া গেছে।
       *[lines] { $startLine }–{ $endLine } নং লাইনে পাওয়া গেছে।
    }
document-contains-errors = এই নথিতে ত্রুটি রয়েছে!
diagnostic-heading-error = ত্রুটি
diagnostic-heading-warning = সতর্কতা
diagnostic-heading-information = তথ্য
diagnostic-heading-hint = ইঙ্গিত
accessibility-heading-level-1 = WCAG AA প্রবেশযোগ্যতা লঙ্ঘন
accessibility-heading-level-2 = প্রবেশযোগ্যতা সতর্কতা
something-went-wrong = কিছু একটা ভুল হয়েছে।
renderer-load-failed = একটি রেন্ডারার লোড করা যায়নি। অনুগ্রহ করে পৃষ্ঠাটি আবার লোড করুন।
core-start-failed = নথি প্রদর্শক চালু করা যায়নি। অনুগ্রহ করে পৃষ্ঠাটি আবার লোড করুন।
