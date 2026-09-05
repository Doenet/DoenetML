# Kumaoni (कुमाऊँनी) viewer chrome: the buttons, panel headers and status words the
# reader interacts with. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari**, which is the only script Kumaoni is written in.
#
# **Method, stated plainly.** Kumaoni has no established register for
# mathematics or for software, so the technical vocabulary of this catalog is
# Hindi — रेखा, बहुभुज, फलन, विशेषता, घटक, संस्करण — the words a Kumaoni
# speaker meets in an Uttarakhand classroom, which teaches out of Hindi
# textbooks. What is Kumaoni here is the grammatical layer written over it:
# the genitive क / की / का rather than Hindi का / की / के, the object marker
# कैं, the copula छ (plural छन), the negative नि, बटि for *from*, दगाड़ for
# *with*, अर for *and*, बान for *for*, किलैकि for *because*, and the -ओ
# imperative (करो, दिखाओ, हटाओ) Kumaoni puts on a button. A reviewer should
# read this as Kumaoni grammar over Hindi terminology and is free to replace
# the terminology wherever Kumaoni has its own word.
#
# Numbers render as 1,234.5 in **Latin digits**, never in Devanagari
# numerals: that is what CLDR gives for the Devanagari-writing languages of
# India, and it is what DoenetML pins for every locale (`src/intl.ts`).
#
# **Nothing selects on a plural category.** CLDR has no plural data for
# `kfy`, so `lint:i18n` would reject a `[one]` branch outright. Every count
# in this file goes through a single `*[other]`, keeping only
# `attempts-remaining`'s explicit `[0]`, which Fluent matches against the
# number itself rather than against a category.

## Answer submission

answer-checking = जाँचा जा रौ छ...
answer-submitting = भेजा जा रौ छ...
answer-checking-status = उत्तर जाँचा जा रौ छ
answer-submitting-status = उत्तर भेजा जा रौ छ
answer-correct = सही
answer-incorrect = ग़लत
answer-response-saved = उत्तर सहेजा गया
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% सही
answer-percent-short = { $percent }%
max-credit-available = अधिकतम संभव अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] कोई प्रयास शेष नि छन
       *[other] { $count } प्रयास शेष
    }
validation-correct = (सही)
validation-incorrect = (ग़लत)
validation-partially-correct = (आंशिक रूप से सही)
answer-show-responses = { $answerId } का { $count } उत्तर दिखाओ

## Disclosure panels

feedback-heading = प्रतिक्रिया
collapsible-click-to-open = (खोलण बान क्लिक करो)
collapsible-click-to-close = (बंद करण बान क्लिक करो)
collapsible-initializing = आरंभ किया जा रौ छ...
footnote-show = पादटिप्पणी दिखाओ
footnote-hide = पादटिप्पणी छिपाओ
description-more-information = अधिक जानकारी

## Controls

slider-previous = पिछलो
slider-next = अगलो
keyboard-open = कीबोर्ड खोलो
keyboard-close = कीबोर्ड बंद करो
choice-input-remove-choice = { $choice } हटाओ
matrix-remove-row = पंक्ति हटाओ
matrix-add-row = पंक्ति जोड़ो
matrix-remove-column = स्तंभ हटाओ
matrix-add-column = स्तंभ जोड़ो
subset-add-remove-points = बिंदु जोड़ो/हटाओ
subset-toggle-points-intervals = बिंदुओं अर अंतरालों क बीच बदलें
subset-move-points = बिंदु खसकाओ
subset-clear = साफ़ करो
orbital-add-row = पंक्ति जोड़ो
orbital-remove-row = पंक्ति हटाओ
orbital-add-box = खाँचा जोड़ो
orbital-remove-box = खाँचा हटाओ
orbital-add-up-arrow = ऊपर क तीर जोड़ो
orbital-add-down-arrow = नीचे क तीर जोड़ो
orbital-remove-arrow = तीर हटाओ
orbital-row-label = पंक्ति { $row } क लेबल
pretzel-answer = उत्तर

## Math input

math-input-preview-region = गणितीय व्यंजक क पूर्वावलोकन
math-input-preview = पूर्वावलोकन
math-input-invalid-expression = अमान्य व्यंजक:

## Document status

viewer-initializing = आरंभ किया जा रौ छ...

## Errors

error-heading = त्रुटि
error-found-at =
    { $span ->
        [line] पंक्ति { $startLine } में मिली।
       *[lines] पंक्तियों { $startLine }–{ $endLine } में मिली।
    }
document-contains-errors = ये दस्तावेज़ में त्रुटियाँ छन!
diagnostic-heading-error = त्रुटि
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = संकेत
accessibility-heading-level-1 = WCAG AA सुगम्यता उल्लंघन
accessibility-heading-level-2 = सुगम्यता चेतावनी
something-went-wrong = कुछ ग़लत हो गया।
renderer-load-failed = एक रेंडरर लोड नि हो सका। किरपा करिबेर पृष्ठ फिर बटि लोड करो।
core-start-failed = यो दस्तावेज़ शुरू नि किया जा सका। किरपा करिबेर पृष्ठ फिर बटि लोड करो।

core-start-failed-busy = यो दस्तावेज़ शुरू नि किया जा सका। एक साथ कई दस्तावेज़ शुरू हो रईं छी, जै में धीमे उपकरण पर अधिक समय लगता छ। बाकी दस्तावेज़ों का पूरा होण पर पृष्ठ फिर बटि लोड करण बटि बात बन सकन छ।

core-start-failed-retry = यो दस्तावेज़ शुरू नि किया जा सका।

core-start-failed-busy-retry = यो दस्तावेज़ शुरू नि किया जा सका। एक साथ कई दस्तावेज़ शुरू हो रईं छी, जै में धीमे उपकरण पर अधिक समय लगता छ।

core-start-retry = फिर बटि कोशिश करो

saved-state-unavailable = आपका सहेजा गया काम लोड नि किया जा सका।
