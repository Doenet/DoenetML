# Marathi viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the bare तुम्ही imperative Marathi puts on a button — कीबोर्ड
# उघडा — which is what a reader expects from software.
#
# Numbers render in Latin digits rather than in Devanagari numerals, which is
# the digit policy in the package README (#1615).


## Answer submission

answer-checking = तपासले जात आहे...
answer-submitting = पाठवले जात आहे...
answer-checking-status = उत्तर तपासले जात आहे
answer-submitting-status = उत्तर पाठवले जात आहे
answer-correct = बरोबर
answer-incorrect = चूक
answer-response-saved = उत्तर जतन केले
answer-percent-credit = { $percent }% गुण
answer-percent-correct = { $percent }% बरोबर
answer-percent-short = { $percent }%
max-credit-available = कमाल शक्य गुण: { $percent }%
attempts-remaining =
    { $count ->
        [0] एकही प्रयत्न शिल्लक नाही
        [one] { $count } प्रयत्न शिल्लक
       *[other] { $count } प्रयत्न शिल्लक
    }
validation-correct = (बरोबर)
validation-incorrect = (चूक)
validation-partially-correct = (अंशतः बरोबर)
answer-show-responses =
    { $count ->
        [one] { $answerId } ची { $count } उत्तरे दाखवा
       *[other] { $answerId } ची { $count } उत्तरे दाखवा
    }

## Disclosure panels

feedback-heading = अभिप्राय
collapsible-click-to-open = (उघडण्यासाठी क्लिक करा)
collapsible-click-to-close = (बंद करण्यासाठी क्लिक करा)
collapsible-initializing = सुरू केले जात आहे...
footnote-show = तळटीप दाखवा
footnote-hide = तळटीप लपवा
description-more-information = अधिक माहिती

## Controls

slider-previous = मागील
slider-next = पुढील
keyboard-open = कीबोर्ड उघडा
keyboard-close = कीबोर्ड बंद करा
choice-input-remove-choice = { $choice } काढा
matrix-remove-row = ओळ काढा
matrix-add-row = ओळ जोडा
matrix-remove-column = स्तंभ काढा
matrix-add-column = स्तंभ जोडा
subset-add-remove-points = बिंदू जोडा/काढा
subset-toggle-points-intervals = बिंदू आणि अंतराल यांमध्ये बदला
subset-move-points = बिंदू हलवा
subset-clear = पुसा
# A `box` here is one orbital, drawn as a square: खण.
orbital-add-row = ओळ जोडा
orbital-remove-row = ओळ काढा
orbital-add-box = खण जोडा
orbital-remove-box = खण काढा
orbital-add-up-arrow = वरचा बाण जोडा
orbital-add-down-arrow = खालचा बाण जोडा
orbital-remove-arrow = बाण काढा
orbital-row-label = ओळ { $row } चे लेबल
pretzel-answer = उत्तर

## Math input

math-input-preview-region = गणिती पदावलीचे पूर्वावलोकन
math-input-preview = पूर्वावलोकन
math-input-invalid-expression = अवैध पदावली:

## Document status

viewer-initializing = सुरू केले जात आहे...

## Errors

error-heading = त्रुटी
error-found-at =
    { $span ->
        [line] ओळ { $startLine } वर आढळली.
       *[lines] ओळ { $startLine }–{ $endLine } वर आढळली.
    }
document-contains-errors = या दस्तऐवजात त्रुटी आहेत!
diagnostic-heading-error = त्रुटी
diagnostic-heading-warning = इशारा
diagnostic-heading-information = माहिती
diagnostic-heading-hint = सूचना
accessibility-heading-level-1 = WCAG AA सुलभता उल्लंघन
accessibility-heading-level-2 = सुलभता इशारा
something-went-wrong = काहीतरी चुकले.
renderer-load-failed = एक रेंडरर लोड होऊ शकला नाही. कृपया पृष्ठ पुन्हा लोड करा.
core-start-failed = दस्तऐवज दर्शक सुरू होऊ शकला नाही. कृपया पृष्ठ पुन्हा लोड करा.
