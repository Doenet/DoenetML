# Hindi viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# A count renders as 1,234 and not in Devanagari numerals. That is Hindi's own
# CLDR numbering system, and it is also what DoenetML pins for every locale
# (`src/intl.ts`), so Marathi and Nepali — which share the script but not the
# numbering system — count the same way.
#
# Controls take the bare imperative Hindi puts on a button — `कीबोर्ड खोलें` —
# which is the आप form without the honorific auxiliary.


## Answer submission

answer-checking = जाँचा जा रहा है...
answer-submitting = भेजा जा रहा है...
answer-checking-status = उत्तर जाँचा जा रहा है
answer-submitting-status = उत्तर भेजा जा रहा है
answer-correct = सही
answer-incorrect = ग़लत
answer-response-saved = उत्तर सहेजा गया
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% सही
answer-percent-short = { $percent }%
max-credit-available = अधिकतम संभव अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] कोई प्रयास शेष नहीं
        [one] { $count } प्रयास शेष
       *[other] { $count } प्रयास शेष
    }
validation-correct = (सही)
validation-incorrect = (ग़लत)
validation-partially-correct = (आंशिक रूप से सही)
answer-show-responses =
    { $count ->
        [one] { $answerId } का { $count } उत्तर दिखाएँ
       *[other] { $answerId } के { $count } उत्तर दिखाएँ
    }

## Disclosure panels

feedback-heading = प्रतिक्रिया
collapsible-click-to-open = (खोलने के लिए क्लिक करें)
collapsible-click-to-close = (बंद करने के लिए क्लिक करें)
collapsible-initializing = आरंभ किया जा रहा है...
footnote-show = पादटिप्पणी दिखाएँ
footnote-hide = पादटिप्पणी छिपाएँ
description-more-information = अधिक जानकारी

## Controls

slider-previous = पिछला
slider-next = अगला
keyboard-open = कीबोर्ड खोलें
keyboard-close = कीबोर्ड बंद करें
choice-input-remove-choice = { $choice } हटाएँ
matrix-remove-row = पंक्ति हटाएँ
matrix-add-row = पंक्ति जोड़ें
matrix-remove-column = स्तंभ हटाएँ
matrix-add-column = स्तंभ जोड़ें
subset-add-remove-points = बिंदु जोड़ें/हटाएँ
subset-toggle-points-intervals = बिंदुओं और अंतरालों के बीच बदलें
subset-move-points = बिंदु खिसकाएँ
subset-clear = साफ़ करें
# A `box` here is one orbital, drawn as a square: खाँचा. Not खाना, whose first
# reading is "food".
orbital-add-row = पंक्ति जोड़ें
orbital-remove-row = पंक्ति हटाएँ
orbital-add-box = खाँचा जोड़ें
orbital-remove-box = खाँचा हटाएँ
orbital-add-up-arrow = ऊपर का तीर जोड़ें
orbital-add-down-arrow = नीचे का तीर जोड़ें
orbital-remove-arrow = तीर हटाएँ
orbital-row-label = पंक्ति { $row } का लेबल
pretzel-answer = उत्तर

## Math input

math-input-preview-region = गणितीय व्यंजक का पूर्वावलोकन
math-input-preview = पूर्वावलोकन
math-input-invalid-expression = अमान्य व्यंजक:

## Document status

viewer-initializing = आरंभ किया जा रहा है...

## Errors

error-heading = त्रुटि
error-found-at =
    { $span ->
        [line] पंक्ति { $startLine } में मिली।
       *[lines] पंक्तियों { $startLine }–{ $endLine } में मिली।
    }
document-contains-errors = इस दस्तावेज़ में त्रुटियाँ हैं!
diagnostic-heading-error = त्रुटि
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = संकेत
accessibility-heading-level-1 = WCAG AA सुगम्यता उल्लंघन
accessibility-heading-level-2 = सुगम्यता चेतावनी
something-went-wrong = कुछ ग़लत हो गया।
renderer-load-failed = एक रेंडरर लोड नहीं हो सका। कृपया पृष्ठ फिर से लोड करें।
core-start-failed = दस्तावेज़ दर्शक शुरू नहीं किया जा सका। कृपया पृष्ठ फिर से लोड करें।
