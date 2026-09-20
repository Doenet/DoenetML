# Manipuri (Meitei) viewer chrome: buttons, panel headers, and other UI the
# reader interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Written in the Bengali script; see `content.ftl`'s header for why, and for
# why a `mni-Mtei` catalog beside this one is owed rather than hypothetical.


## Answer submission

answer-checking = য়েংশিল্লি…
answer-submitting = থাদোক্লি…
answer-checking-status = পাউখুম য়েংশিল্লি
answer-submitting-status = পাউখুম থাদোক্লি
answer-correct = অচুম্বা
answer-incorrect = অরানবা
answer-response-saved = পাউখুম থমজিনখ্রে
answer-percent-credit = { $percent }% মাক
answer-percent-correct = { $percent }% অচুম্বা
answer-percent-short = { $percent } %
max-credit-available = ফংবা য়াবা খ্বাইদগী য়াম্বা মাক: { $percent }%
attempts-remaining =
    { $count ->
        [0] হোৎনবা অমত্তা লৈত্রে
        [one] হোৎনবা { $count } লৈরি
       *[other] হোৎনবা { $count } লৈরি
    }
validation-correct = (অচুম্বা)
validation-incorrect = (অরানবা)
validation-partially-correct = (শরুক অমা অচুম্বা)
answer-show-responses =
    { $count ->
        [one] { $answerId }গী পাউখুম { $count } উৎলু
       *[other] { $answerId }গী পাউখুম { $count } উৎলু
    }

## Disclosure panels

feedback-heading = পাউখুম ৱারোল
collapsible-click-to-open = (হাংদোক্নবা ক্লিক তৌরো)
collapsible-click-to-close = (থিংজিন্নবা ক্লিক তৌরো)
collapsible-initializing = হৌরকলি…
footnote-show = খোঙজেল ৱারোল উৎলু
footnote-hide = খোঙজেল ৱারোল লোৎলু
description-more-information = হেন্না পাউ

## Controls

slider-previous = মমাংগী
slider-next = মথংগী
keyboard-open = কীবোর্দ হাংদোকউ
keyboard-close = কীবোর্দ থিংজিল্লু
choice-input-remove-choice = { $choice } লৌথোকউ
matrix-remove-row = পরিং লৌথোকউ
matrix-add-row = পরিং হাপচিল্লু
matrix-remove-column = কোলম লৌথোকউ
matrix-add-column = কোলম হাপচিল্লু
subset-add-remove-points = চেৎ হাপচিল্লু/লৌথোকউ
subset-toggle-points-intervals = চেৎ অমসুং অন্তরাল হোংদোকউ
subset-move-points = চেৎ হোংদোকউ
subset-clear = মুত্থৎলু
orbital-add-row = পরিং হাপচিল্লু
orbital-remove-row = পরিং লৌথোকউ
orbital-add-box = বক্স হাপচিল্লু
orbital-remove-box = বক্স লৌথোকউ
orbital-add-up-arrow = মথক্তা চংবা তেন হাপচিল্লু
orbital-add-down-arrow = মখাদা চংবা তেন হাপচিল্লু
orbital-remove-arrow = তেন লৌথোকউ
orbital-row-label = পরিং { $row }গী মমিং
pretzel-answer = পাউখুম

## Math input

math-input-preview-region = গণিতকী ৱাহৈ ময়েক অহানবা উবা
math-input-preview = অহানবা উবা
math-input-invalid-expression = অরানবা ৱাহৈ ময়েক:

## Document status

viewer-initializing = হৌরকলি…

## Errors

error-heading = অশোয়বা
error-found-at =
    { $span ->
        [line] পরেং { $startLine }দা ফংলে।
       *[lines] পরেং { $startLine }–{ $endLine }দা ফংলে।
    }
document-contains-errors = দোকুমেন্ত অসিদা অশোয়বা লৈরি!
diagnostic-heading-error = অশোয়বা
diagnostic-heading-warning = চেকশিন ৱাফম
diagnostic-heading-information = পাউ
diagnostic-heading-hint = খুদম
accessibility-heading-level-1 = WCAG AA শিজিন্নবা য়াবগী ৱাথোক
accessibility-heading-level-2 = শিজিন্নবা য়াবগী চেকশিন ৱাফম
something-went-wrong = করিগুম্বা অমা শোয়খ্রে।
renderer-load-failed = উৎপা মশীন অমা লোদ তৌবা ঙমখিদে। লামায় অসি অমুক হন্না লোদ তৌবিয়ু।
core-start-failed = দোকুমেন্ত উৎপা মশীন হৌবা ঙমখিদে। লামায় অসি অমুক হন্না লোদ তৌবিয়ু।
