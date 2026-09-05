# Assamese viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the -ক imperative Assamese puts on a button — কীব'ৰ্ড খোলক —
# which is the আপুনি form and is what a reader expects from software.
#
# A counted noun is not pluralized in Assamese, so both plural branches read
# the same wherever the noun is the only thing that would have changed.


## Answer submission

answer-checking = পৰীক্ষা কৰি থকা হৈছে...
answer-submitting = পঠিওৱা হৈছে...
answer-checking-status = উত্তৰ পৰীক্ষা কৰি থকা হৈছে
answer-submitting-status = উত্তৰ পঠিওৱা হৈছে
answer-correct = শুদ্ধ
answer-incorrect = ভুল
answer-response-saved = উত্তৰ সংৰক্ষণ কৰা হ'ল
answer-percent-credit = { $percent }% নম্বৰ
answer-percent-correct = { $percent }% শুদ্ধ
answer-percent-short = { $percent }%
max-credit-available = সৰ্বাধিক সম্ভাৱ্য নম্বৰ: { $percent }%
attempts-remaining =
    { $count ->
        [0] কোনো প্ৰয়াস বাকী নাই
        [one] { $count }টা প্ৰয়াস বাকী
       *[other] { $count }টা প্ৰয়াস বাকী
    }
validation-correct = (শুদ্ধ)
validation-incorrect = (ভুল)
validation-partially-correct = (আংশিকভাৱে শুদ্ধ)
answer-show-responses =
    { $count ->
        [one] { $answerId }-ৰ { $count }টা উত্তৰ দেখুৱাওক
       *[other] { $answerId }-ৰ { $count }টা উত্তৰ দেখুৱাওক
    }

## Disclosure panels

feedback-heading = প্ৰতিক্ৰিয়া
collapsible-click-to-open = (খুলিবলৈ ক্লিক কৰক)
collapsible-click-to-close = (বন্ধ কৰিবলৈ ক্লিক কৰক)
collapsible-initializing = আৰম্ভ কৰা হৈছে...
footnote-show = পাদটীকা দেখুৱাওক
footnote-hide = পাদটীকা লুকুৱাওক
description-more-information = অধিক তথ্য

## Controls

slider-previous = পূৰ্বৱৰ্তী
slider-next = পৰৱৰ্তী
keyboard-open = কীব'ৰ্ড খোলক
keyboard-close = কীব'ৰ্ড বন্ধ কৰক
choice-input-remove-choice = { $choice } আঁতৰাওক
matrix-remove-row = শাৰী আঁতৰাওক
matrix-add-row = শাৰী যোগ কৰক
matrix-remove-column = স্তম্ভ আঁতৰাওক
matrix-add-column = স্তম্ভ যোগ কৰক
subset-add-remove-points = বিন্দু যোগ/আঁতৰাওক
subset-toggle-points-intervals = বিন্দু আৰু অন্তৰালৰ মাজত সলনি কৰক
subset-move-points = বিন্দু লৰাওক
subset-clear = পৰিষ্কাৰ কৰক
# A `box` here is one orbital, drawn as a square: ঘৰ.
orbital-add-row = শাৰী যোগ কৰক
orbital-remove-row = শাৰী আঁতৰাওক
orbital-add-box = ঘৰ যোগ কৰক
orbital-remove-box = ঘৰ আঁতৰাওক
orbital-add-up-arrow = ওপৰমুৱা কাঁড় যোগ কৰক
orbital-add-down-arrow = তলমুৱা কাঁড় যোগ কৰক
orbital-remove-arrow = কাঁড় আঁতৰাওক
orbital-row-label = { $row } নং শাৰীৰ লেবেল
pretzel-answer = উত্তৰ

## Math input

math-input-preview-region = গাণিতিক ৰাশিৰ পূৰ্বদৃশ্য
math-input-preview = পূৰ্বদৃশ্য
math-input-invalid-expression = অবৈধ ৰাশি:

## Document status

viewer-initializing = আৰম্ভ কৰা হৈছে...

## Errors

error-heading = ত্ৰুটি
error-found-at =
    { $span ->
        [line] { $startLine } নং শাৰীত পোৱা গৈছে।
       *[lines] { $startLine }–{ $endLine } নং শাৰীত পোৱা গৈছে।
    }
document-contains-errors = এই নথিত ত্ৰুটি আছে!
diagnostic-heading-error = ত্ৰুটি
diagnostic-heading-warning = সতৰ্কবাণী
diagnostic-heading-information = তথ্য
diagnostic-heading-hint = ইংগিত
accessibility-heading-level-1 = WCAG AA প্ৰৱেশযোগ্যতা উলংঘন
accessibility-heading-level-2 = প্ৰৱেশযোগ্যতা সতৰ্কবাণী
something-went-wrong = কিবা এটা ভুল হ'ল।
renderer-load-failed = এটা ৰেণ্ডাৰাৰ ল'ড কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি পৃষ্ঠাটো আকৌ ল'ড কৰক।
core-start-failed = নথি প্ৰদৰ্শক আৰম্ভ কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি পৃষ্ঠাটো আকৌ ল'ড কৰক।
