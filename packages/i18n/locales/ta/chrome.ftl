# Tamil viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the bare நீ imperative Tamil puts on a button — «விசைப்பலகையைத்
# திற» — which is what a reader expects from software.
#
# Tamil counts in two plural categories and marks the plural on the noun, so
# both are written out where the noun changes. `[0]` is spelled out where the
# English wording changes for zero, which is a different sentence rather than
# a different number.
#
# Numbers render in Latin digits rather than in Tamil numerals, which is the
# digit policy in the package README (#1615).


## Answer submission

answer-checking = சரிபார்க்கிறது...
answer-submitting = சமர்ப்பிக்கிறது...
answer-checking-status = விடை சரிபார்க்கப்படுகிறது
answer-submitting-status = விடை சமர்ப்பிக்கப்படுகிறது
answer-correct = சரி
answer-incorrect = தவறு
answer-response-saved = பதில் சேமிக்கப்பட்டது
answer-percent-credit = { $percent }% மதிப்பெண்
answer-percent-correct = { $percent }% சரி
answer-percent-short = { $percent }%
max-credit-available = கிடைக்கக்கூடிய அதிகபட்ச மதிப்பெண்: { $percent }%
attempts-remaining =
    { $count ->
        [0] முயற்சிகள் எதுவும் மீதமில்லை
        [one] { $count } முயற்சி மீதமுள்ளது
       *[other] { $count } முயற்சிகள் மீதமுள்ளன
    }
validation-correct = (சரி)
validation-incorrect = (தவறு)
validation-partially-correct = (பகுதியளவு சரி)
answer-show-responses =
    { $count ->
        [one] { $answerId } க்கான { $count } பதிலைக் காட்டு
       *[other] { $answerId } க்கான { $count } பதில்களைக் காட்டு
    }

## Disclosure panels

feedback-heading = பின்னூட்டம்
collapsible-click-to-open = (திறக்க சொடுக்கவும்)
collapsible-click-to-close = (மூட சொடுக்கவும்)
collapsible-initializing = தொடங்குகிறது...
footnote-show = அடிக்குறிப்பைக் காட்டு
footnote-hide = அடிக்குறிப்பை மறை
description-more-information = கூடுதல் தகவல்

## Controls

slider-previous = முந்தையது
slider-next = அடுத்தது
keyboard-open = விசைப்பலகையைத் திற
keyboard-close = விசைப்பலகையை மூடு
choice-input-remove-choice = { $choice } ஐ நீக்கு
matrix-remove-row = வரிசையை நீக்கு
matrix-add-row = வரிசையைச் சேர்
matrix-remove-column = நிரலை நீக்கு
matrix-add-column = நிரலைச் சேர்
subset-add-remove-points = புள்ளிகளைச் சேர்/நீக்கு
subset-toggle-points-intervals = புள்ளிகளுக்கும் இடைவெளிகளுக்கும் இடையே மாற்று
subset-move-points = புள்ளிகளை நகர்த்து
subset-clear = அழி
# A `box` here is one orbital, drawn as a square: கட்டம்.
orbital-add-row = வரிசையைச் சேர்
orbital-remove-row = வரிசையை நீக்கு
orbital-add-box = கட்டத்தைச் சேர்
orbital-remove-box = கட்டத்தை நீக்கு
orbital-add-up-arrow = மேல் அம்புக்குறியைச் சேர்
orbital-add-down-arrow = கீழ் அம்புக்குறியைச் சேர்
orbital-remove-arrow = அம்புக்குறியை நீக்கு
orbital-row-label = வரிசை { $row } க்கான லேபிள்
pretzel-answer = விடை

## Math input

math-input-preview-region = கணிதக் கோவை முன்னோட்டம்
math-input-preview = முன்னோட்டம்
math-input-invalid-expression = தவறான கோவை:

## Document status

viewer-initializing = தொடங்குகிறது...

## Errors

error-heading = பிழை
error-found-at =
    { $span ->
        [line] வரி { $startLine } இல் கண்டறியப்பட்டது.
       *[lines] { $startLine }–{ $endLine } வரிகளில் கண்டறியப்பட்டது.
    }
document-contains-errors = இந்த ஆவணத்தில் பிழைகள் உள்ளன!
diagnostic-heading-error = பிழை
diagnostic-heading-warning = எச்சரிக்கை
diagnostic-heading-information = தகவல்
diagnostic-heading-hint = உதவிக்குறிப்பு
accessibility-heading-level-1 = WCAG AA அணுகல்தன்மை மீறல்
accessibility-heading-level-2 = அணுகல்தன்மை எச்சரிக்கை
something-went-wrong = ஏதோ தவறாகிவிட்டது.
renderer-load-failed = ஒரு காட்சியாக்கி ஏற்றப்படவில்லை. பக்கத்தை மீண்டும் ஏற்றவும்.
core-start-failed = ஆவணக் காட்சியாக்கியைத் தொடங்க முடியவில்லை. பக்கத்தை மீண்டும் ஏற்றவும்.
