# Bhojpuri viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Written in Devanagari; see `content.ftl`'s header. Buttons take the plain
# imperative in -ीं, which is the everyday polite form Bhojpuri instructional
# prose uses.


## Answer submission

answer-checking = जाँच होखत बा…
answer-submitting = भेजल जात बा…
answer-checking-status = जवाब के जाँच होखत बा
answer-submitting-status = जवाब भेजल जात बा
answer-correct = सही
answer-incorrect = गलत
answer-response-saved = जवाब सहेजल गइल
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% सही
answer-percent-short = { $percent } %
max-credit-available = ज्यादा से ज्यादा मिलल अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] कवनो कोशिश ना बचल
        [one] { $count } कोशिश बाकी
       *[other] { $count } कोशिश बाकी
    }
validation-correct = (सही)
validation-incorrect = (गलत)
validation-partially-correct = (कुछ हद तक सही)
answer-show-responses =
    { $count ->
        [one] { $answerId } खातिर { $count } जवाब देखाईं
       *[other] { $answerId } खातिर { $count } जवाब देखाईं
    }

## Disclosure panels

feedback-heading = प्रतिपुष्टि
collapsible-click-to-open = (खोले खातिर क्लिक करीं)
collapsible-click-to-close = (बंद करे खातिर क्लिक करीं)
collapsible-initializing = शुरू होखत बा…
footnote-show = पादटीप देखाईं
footnote-hide = पादटीप छिपाईं
description-more-information = अउरी जानकारी

## Controls

slider-previous = पहिले वाला
slider-next = अगिला
keyboard-open = कुंजीपटल खोलीं
keyboard-close = कुंजीपटल बंद करीं
choice-input-remove-choice = { $choice } हटाईं
matrix-remove-row = पाँती हटाईं
matrix-add-row = पाँती जोड़ीं
matrix-remove-column = स्तंभ हटाईं
matrix-add-column = स्तंभ जोड़ीं
subset-add-remove-points = बिंदु जोड़ीं/हटाईं
subset-toggle-points-intervals = बिंदु आ अंतराल बदलीं
subset-move-points = बिंदु सरकाईं
subset-clear = मिटाईं
orbital-add-row = पाँती जोड़ीं
orbital-remove-row = पाँती हटाईं
orbital-add-box = बक्सा जोड़ीं
orbital-remove-box = बक्सा हटाईं
orbital-add-up-arrow = ऊपर वाला तीर जोड़ीं
orbital-add-down-arrow = नीचे वाला तीर जोड़ीं
orbital-remove-arrow = तीर हटाईं
orbital-row-label = पाँती { $row } के लेबल
pretzel-answer = जवाब

## Math input

math-input-preview-region = गणित के व्यंजन के झलक
math-input-preview = झलक
math-input-invalid-expression = अमान्य व्यंजन:

## Document status

viewer-initializing = शुरू होखत बा…

## Errors

error-heading = गलती
error-found-at =
    { $span ->
        [line] पाँती { $startLine } पर मिलल।
       *[lines] पाँती { $startLine }–{ $endLine } पर मिलल।
    }
document-contains-errors = ई दस्तावेज में गलती बा!
diagnostic-heading-error = गलती
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = संकेत
accessibility-heading-level-1 = WCAG AA सुगम्यता के उल्लंघन
accessibility-heading-level-2 = सुगम्यता के सूचना
something-went-wrong = कुछ गड़बड़ हो गइल।
renderer-load-failed = एगो प्रदर्शक लोड ना हो सकल। कृपया पन्ना फेर से लोड करीं।
core-start-failed = दस्तावेज दर्शक शुरू ना हो सकल। कृपया पन्ना फेर से लोड करीं।
