# Dogri viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Dogri proper in Devanagari; see `content.ftl`'s header for the script and
# macrolanguage notes. Buttons take the -ओ imperative.


## Answer submission

answer-checking = जाँच होआ‌ करदी ऐ…
answer-submitting = भेजेआ जा करदा ऐ…
answer-checking-status = जवाब दी जाँच होआ करदी ऐ
answer-submitting-status = जवाब भेजेआ जा करदा ऐ
answer-correct = ठीक
answer-incorrect = गलत
answer-response-saved = जवाब सांभेआ गेआ
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% ठीक
answer-percent-short = { $percent } %
max-credit-available = बद्धोबद्ध मिलने आले अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] कोई कोशश नेईं बची
        [one] { $count } कोशश बाकी
       *[other] { $count } कोशशां बाकी
    }
validation-correct = (ठीक)
validation-incorrect = (गलत)
validation-partially-correct = (कुछ हद तगर ठीक)
answer-show-responses =
    { $count ->
        [one] { $answerId } आस्तै { $count } जवाब दस्सो
       *[other] { $answerId } आस्तै { $count } जवाब दस्सो
    }

## Disclosure panels

feedback-heading = प्रतिक्रिया
collapsible-click-to-open = (खोह्लने आस्तै क्लिक करो)
collapsible-click-to-close = (बंद करने आस्तै क्लिक करो)
collapsible-initializing = शुरू होआ करदा ऐ…
footnote-show = पादटिप्पणी दस्सो
footnote-hide = पादटिप्पणी लकाओ
description-more-information = होर जानकारी

## Controls

slider-previous = पिछला
slider-next = अगला
keyboard-open = कुंजीपटल खोह्लो
keyboard-close = कुंजीपटल बंद करो
choice-input-remove-choice = { $choice } हटाओ
matrix-remove-row = पंगत हटाओ
matrix-add-row = पंगत जोड़ो
matrix-remove-column = स्तंभ हटाओ
matrix-add-column = स्तंभ जोड़ो
subset-add-remove-points = बिंदू जोड़ो/हटाओ
subset-toggle-points-intervals = बिंदू ते अंतराल बदलो
subset-move-points = बिंदू सरकाओ
subset-clear = मटाओ
orbital-add-row = पंगत जोड़ो
orbital-remove-row = पंगत हटाओ
orbital-add-box = डिब्बा जोड़ो
orbital-remove-box = डिब्बा हटाओ
orbital-add-up-arrow = उप्पर आला तीर जोड़ो
orbital-add-down-arrow = थल्ले आला तीर जोड़ो
orbital-remove-arrow = तीर हटाओ
orbital-row-label = पंगत { $row } दा लेबल
pretzel-answer = जवाब

## Math input

math-input-preview-region = गणित दे व्यंजन दी झलक
math-input-preview = झलक
math-input-invalid-expression = गलत व्यंजन:

## Document status

viewer-initializing = शुरू होआ करदा ऐ…

## Errors

error-heading = गलती
error-found-at =
    { $span ->
        [line] पंगत { $startLine } पर मिली।
       *[lines] पंगत { $startLine }–{ $endLine } पर मिली।
    }
document-contains-errors = इस दस्तावेज च गलतियां न!
diagnostic-heading-error = गलती
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = इशारा
accessibility-heading-level-1 = WCAG AA सुगमता दा उल्लंघन
accessibility-heading-level-2 = सुगमता दी सूचना
something-went-wrong = कुछ गड़बड़ होई गेई।
renderer-load-failed = इक प्रदर्शक लोड नेईं होई सकेआ। कृपा करियै सफा फ्ही लोड करो।
core-start-failed = दस्तावेज दर्शक शुरू नेईं होई सकेआ। कृपा करियै सफा फ्ही लोड करो।
