# Nepali viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the -नुहोस् imperative Nepali puts on a button — किबोर्ड
# खोल्नुहोस् — which is the तपाईं form and is what a reader expects from
# software.
#
# Numbers render in Latin digits rather than in Devanagari numerals, which is
# the digit policy in the package README (#1615).


## Answer submission

answer-checking = जाँच गरिँदै छ...
answer-submitting = पठाइँदै छ...
answer-checking-status = उत्तर जाँच गरिँदै छ
answer-submitting-status = उत्तर पठाइँदै छ
answer-correct = सही
answer-incorrect = गलत
answer-response-saved = उत्तर सुरक्षित गरियो
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% सही
answer-percent-short = { $percent }%
max-credit-available = अधिकतम सम्भव अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] कुनै प्रयास बाँकी छैन
        [one] { $count } प्रयास बाँकी
       *[other] { $count } प्रयास बाँकी
    }
validation-correct = (सही)
validation-incorrect = (गलत)
validation-partially-correct = (आंशिक रूपमा सही)
answer-show-responses =
    { $count ->
        [one] { $answerId } का { $count } उत्तर देखाउनुहोस्
       *[other] { $answerId } का { $count } उत्तर देखाउनुहोस्
    }

## Disclosure panels

feedback-heading = प्रतिक्रिया
collapsible-click-to-open = (खोल्न क्लिक गर्नुहोस्)
collapsible-click-to-close = (बन्द गर्न क्लिक गर्नुहोस्)
collapsible-initializing = सुरु गरिँदै छ...
footnote-show = पादटिप्पणी देखाउनुहोस्
footnote-hide = पादटिप्पणी लुकाउनुहोस्
description-more-information = थप जानकारी

## Controls

slider-previous = अघिल्लो
slider-next = अर्को
keyboard-open = किबोर्ड खोल्नुहोस्
keyboard-close = किबोर्ड बन्द गर्नुहोस्
choice-input-remove-choice = { $choice } हटाउनुहोस्
matrix-remove-row = पङ्क्ति हटाउनुहोस्
matrix-add-row = पङ्क्ति थप्नुहोस्
matrix-remove-column = स्तम्भ हटाउनुहोस्
matrix-add-column = स्तम्भ थप्नुहोस्
subset-add-remove-points = बिन्दु थप्नुहोस्/हटाउनुहोस्
subset-toggle-points-intervals = बिन्दु र अन्तरालबीच फेर्नुहोस्
subset-move-points = बिन्दु सार्नुहोस्
subset-clear = मेट्नुहोस्
# A `box` here is one orbital, drawn as a square: कोठा.
orbital-add-row = पङ्क्ति थप्नुहोस्
orbital-remove-row = पङ्क्ति हटाउनुहोस्
orbital-add-box = कोठा थप्नुहोस्
orbital-remove-box = कोठा हटाउनुहोस्
orbital-add-up-arrow = माथिको तीर थप्नुहोस्
orbital-add-down-arrow = तलको तीर थप्नुहोस्
orbital-remove-arrow = तीर हटाउनुहोस्
orbital-row-label = पङ्क्ति { $row } को लेबल
pretzel-answer = उत्तर

## Math input

math-input-preview-region = गणितीय अभिव्यक्तिको पूर्वावलोकन
math-input-preview = पूर्वावलोकन
math-input-invalid-expression = अमान्य अभिव्यक्ति:

## Document status

viewer-initializing = सुरु गरिँदै छ...

## Errors

error-heading = त्रुटि
error-found-at =
    { $span ->
        [line] पङ्क्ति { $startLine } मा भेटियो।
       *[lines] पङ्क्ति { $startLine }–{ $endLine } मा भेटियो।
    }
document-contains-errors = यो कागजातमा त्रुटिहरू छन्!
diagnostic-heading-error = त्रुटि
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = संकेत
accessibility-heading-level-1 = WCAG AA पहुँचयोग्यता उल्लङ्घन
accessibility-heading-level-2 = पहुँचयोग्यता चेतावनी
something-went-wrong = केही गडबड भयो।
renderer-load-failed = एउटा रेन्डरर लोड हुन सकेन। कृपया पृष्ठ फेरि लोड गर्नुहोस्।
core-start-failed = कागजात दर्शक सुरु हुन सकेन। कृपया पृष्ठ फेरि लोड गर्नुहोस्।
