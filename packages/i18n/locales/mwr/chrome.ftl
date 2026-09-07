# Marwari (मारवाड़ी) viewer chrome: the buttons, panel headers and status words the
# reader interacts with. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari.** Marwari is written in Devanagari today, in print
# and online; the Mahajani script it once used for accounts is not a running
# script for prose and is not attempted here.
#
# **Method, stated plainly.** Marwari has no established register for
# mathematics or for software, so the technical vocabulary of this catalog is
# Hindi — रेखा, बहुभुज, फलन, विशेषता, घटक, संस्करण — the words a Marwari
# speaker meets in a Rajasthani classroom, which teaches out of Hindi
# textbooks. What is Marwari here is the grammatical layer written over it:
# the genitive रो / री / रा rather than Hindi का / की / के, the object marker
# नै, the copula छै, the negative कोनी, मांय for *in*, सूं for *from*, अर for
# *and*, कै for *or*, जे for *if*, रै वास्ते for *for*, and the -ओ imperative
# (करो, दिखावो, हटावो) that Marwari puts on a button. A reviewer should read
# this as Marwari grammar over Hindi terminology and is free to replace the
# terminology wherever Marwari has its own word.
#
# Numbers render as 1,234.5 in **Latin digits**, never in Devanagari
# numerals: that is what CLDR gives for the Devanagari-writing languages of
# India, and it is what DoenetML pins for every locale (`src/intl.ts`).
#
# **Nothing selects on a plural category.** CLDR has no plural data for
# `mwr`, so `lint:i18n` would reject a `[one]` branch outright. Every count
# in this file goes through a single `*[other]`, keeping only
# `attempts-remaining`'s explicit `[0]`, which Fluent matches against the
# number itself rather than against a category.

## Answer submission

answer-checking = जाँच्यो जा रैयो छै...
answer-submitting = भेज्यो जा रैयो छै...
answer-checking-status = उत्तर जाँच्यो जा रैयो छै
answer-submitting-status = उत्तर भेज्यो जा रैयो छै
answer-correct = सही
answer-incorrect = ग़लत
answer-response-saved = उत्तर सहेज्यो गयो
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% सही
answer-percent-short = { $percent }%
max-credit-available = अधिकतम संभव अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] कोई प्रयास शेष कोनी
       *[other] { $count } प्रयास शेष
    }
validation-correct = (सही)
validation-incorrect = (ग़लत)
validation-partially-correct = (आंशिक रूप सूं सही)
answer-show-responses = { $answerId } रा { $count } उत्तर दिखावो

## Disclosure panels

feedback-heading = प्रतिक्रिया
collapsible-click-to-open = (खोलण रै वास्ते क्लिक करो)
collapsible-click-to-close = (बंद करण रै वास्ते क्लिक करो)
collapsible-initializing = आरंभ करियो जा रैयो छै...
footnote-show = पादटिप्पणी दिखावो
footnote-hide = पादटिप्पणी छिपावो
description-more-information = अधिक जानकारी

## Controls

slider-previous = पिछलो
slider-next = अगलो
keyboard-open = कीबोर्ड खोलो
keyboard-close = कीबोर्ड बंद करो
choice-input-remove-choice = { $choice } हटावो
matrix-remove-row = पंक्ति हटावो
matrix-add-row = पंक्ति जोड़ो
matrix-remove-column = स्तंभ हटावो
matrix-add-column = स्तंभ जोड़ो
subset-add-remove-points = बिंदु जोड़ो/हटावो
subset-toggle-points-intervals = बिंदुओं अर अंतरालों रै बिचाळै बदलें
subset-move-points = बिंदु खिसकावो
subset-clear = साफ़ करो
orbital-add-row = पंक्ति जोड़ो
orbital-remove-row = पंक्ति हटावो
orbital-add-box = खाँचा जोड़ो
orbital-remove-box = खाँचा हटावो
orbital-add-up-arrow = ऊपर रो तीर जोड़ो
orbital-add-down-arrow = नीचे रो तीर जोड़ो
orbital-remove-arrow = तीर हटावो
orbital-row-label = पंक्ति { $row } रो लेबल
pretzel-answer = उत्तर

## Math input

math-input-preview-region = गणितीय व्यंजक रो पूर्वावलोकन
math-input-preview = पूर्वावलोकन
math-input-invalid-expression = अमान्य व्यंजक:

## Document status

viewer-initializing = आरंभ करियो जा रैयो छै...

## Errors

error-heading = त्रुटि
error-found-at =
    { $span ->
        [line] पंक्ति { $startLine } मांय मिली।
       *[lines] पंक्तियों { $startLine }–{ $endLine } मांय मिली।
    }
document-contains-errors = इण दस्तावेज़ मांय त्रुटियाँ छै!
diagnostic-heading-error = त्रुटि
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = संकेत
accessibility-heading-level-1 = WCAG AA सुगम्यता उल्लंघन
accessibility-heading-level-2 = सुगम्यता चेतावनी
something-went-wrong = कुछ ग़लत हो गयो।
renderer-load-failed = एक रेंडरर लोड कोनी हो सका। किरपा कर'र पृष्ठ फेरूं लोड करो।
core-start-failed = आ दस्तावेज़ शुरू कोनी करियो जा सका। किरपा कर'र पृष्ठ फेरूं लोड करो।

core-start-failed-busy = आ दस्तावेज़ शुरू कोनी करियो जा सका। एक साथ कई दस्तावेज़ शुरू हो रैया हा, जिण मांय धीमे उपकरण पर अधिक समय लगता छै। बाकी दस्तावेज़ों रा पूरा होण पर पृष्ठ फेरूं लोड करण सूं बात बन सकै छै।

core-start-failed-retry = आ दस्तावेज़ शुरू कोनी करियो जा सका।

core-start-failed-busy-retry = आ दस्तावेज़ शुरू कोनी करियो जा सका। एक साथ कई दस्तावेज़ शुरू हो रैया हा, जिण मांय धीमे उपकरण पर अधिक समय लगता छै।

core-start-retry = फेरूं कोशिश करो

saved-state-unavailable = आपका सहेज्यो गयो काम लोड कोनी करियो जा सका।
