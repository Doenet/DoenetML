# Maithili viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Written in Devanagari; see `content.ftl`'s header. Buttons are in the plain
# imperative, which is what Maithili instructional prose addressed to a reader
# uses.


## Answer submission

answer-checking = जाँचि रहल अछि…
answer-submitting = पठा रहल अछि…
answer-checking-status = उत्तर जाँचि रहल अछि
answer-submitting-status = उत्तर पठा रहल अछि
answer-correct = सही
answer-incorrect = गलत
answer-response-saved = उत्तर सहेजल गेल
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% सही
answer-percent-short = { $percent } %
max-credit-available = अधिकतम उपलब्ध अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] कोनो प्रयास बाँकी नहि
        [one] { $count } प्रयास बाँकी
       *[other] { $count } प्रयास बाँकी
    }
validation-correct = (सही)
validation-incorrect = (गलत)
validation-partially-correct = (आंशिक रूपेँ सही)
answer-show-responses =
    { $count ->
        [one] { $answerId } लेल { $count } उत्तर देखाउ
       *[other] { $answerId } लेल { $count } उत्तर देखाउ
    }

## Disclosure panels

feedback-heading = प्रतिपुष्टि
collapsible-click-to-open = (खोलबा लेल क्लिक करू)
collapsible-click-to-close = (बंद करबा लेल क्लिक करू)
collapsible-initializing = शुरू भऽ रहल अछि…
footnote-show = पादटीप देखाउ
footnote-hide = पादटीप नुकाउ
description-more-information = आओर जानकारी

## Controls

slider-previous = पछिला
slider-next = अगिला
keyboard-open = कुंजीपटल खोलू
keyboard-close = कुंजीपटल बंद करू
choice-input-remove-choice = { $choice } हटाउ
matrix-remove-row = पाँती हटाउ
matrix-add-row = पाँती जोड़ू
matrix-remove-column = स्तंभ हटाउ
matrix-add-column = स्तंभ जोड़ू
subset-add-remove-points = बिंदु जोड़ू/हटाउ
subset-toggle-points-intervals = बिंदु आ अंतराल बदलू
subset-move-points = बिंदु घसकाउ
subset-clear = मेटाउ
orbital-add-row = पाँती जोड़ू
orbital-remove-row = पाँती हटाउ
orbital-add-box = बक्सा जोड़ू
orbital-remove-box = बक्सा हटाउ
orbital-add-up-arrow = ऊपर वला तीर जोड़ू
orbital-add-down-arrow = नीचाँ वला तीर जोड़ू
orbital-remove-arrow = तीर हटाउ
orbital-row-label = पाँती { $row } क लेबल
pretzel-answer = उत्तर

## Math input

math-input-preview-region = गणितीय व्यंजन क पूर्वावलोकन
math-input-preview = पूर्वावलोकन
math-input-invalid-expression = अमान्य व्यंजन:

## Document status

viewer-initializing = शुरू भऽ रहल अछि…

## Errors

error-heading = त्रुटि
error-found-at =
    { $span ->
        [line] पाँती { $startLine } पर भेटल।
       *[lines] पाँती { $startLine }–{ $endLine } पर भेटल।
    }
document-contains-errors = ई दस्तावेज मे त्रुटि अछि!
diagnostic-heading-error = त्रुटि
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = संकेत
accessibility-heading-level-1 = WCAG AA सुगम्यता उल्लंघन
accessibility-heading-level-2 = सुगम्यता सूचना
something-went-wrong = किछु गड़बड़ भऽ गेल।
renderer-load-failed = एकटा प्रदर्शक लोड नहि भऽ सकल। कृपया पृष्ठ फेर लोड करू।
core-start-failed = दस्तावेज दर्शक शुरू नहि भऽ सकल। कृपया पृष्ठ फेर लोड करू।
