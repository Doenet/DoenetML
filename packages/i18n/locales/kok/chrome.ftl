# Konkani viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Goan Konkani in Devanagari; see `content.ftl`'s header for the script and
# macrolanguage notes. Buttons take the -आत imperative, which is the everyday
# polite form Konkani instructional prose uses.


## Answer submission

answer-checking = तपासता…
answer-submitting = धाडटा…
answer-checking-status = जाप तपासता
answer-submitting-status = जाप धाडटा
answer-correct = बरोबर
answer-incorrect = चुकीचें
answer-response-saved = जाप जतनाय केली
answer-percent-credit = { $percent }% गुण
answer-percent-correct = { $percent }% बरोबर
answer-percent-short = { $percent } %
max-credit-available = चडांत चड मेळपाचे गुण: { $percent }%
attempts-remaining =
    { $count ->
        [0] एकूय यत्न उरूंक ना
        [one] { $count } यत्न उरला
       *[other] { $count } यत्न उरल्यात
    }
validation-correct = (बरोबर)
validation-incorrect = (चुकीचें)
validation-partially-correct = (अर्दकुटें बरोबर)
answer-show-responses =
    { $count ->
        [one] { $answerId } खातीर { $count } जाप दाखयात
       *[other] { $answerId } खातीर { $count } जापो दाखयात
    }

## Disclosure panels

feedback-heading = प्रतिसाद
collapsible-click-to-open = (उगडपाक क्लिक करात)
collapsible-click-to-close = (बंद करपाक क्लिक करात)
collapsible-initializing = सुरू जाता…
footnote-show = तळटीप दाखयात
footnote-hide = तळटीप लिपयात
description-more-information = चड म्हायती

## Controls

slider-previous = फाटलें
slider-next = फुडलें
keyboard-open = कळफलक उगडात
keyboard-close = कळफलक बंद करात
choice-input-remove-choice = { $choice } काडून उडयात
matrix-remove-row = ओळ काडून उडयात
matrix-add-row = ओळ जोडात
matrix-remove-column = स्तंभ काडून उडयात
matrix-add-column = स्तंभ जोडात
subset-add-remove-points = बिंदू जोडात/काडात
subset-toggle-points-intervals = बिंदू आनी अंतराळ बदलात
subset-move-points = बिंदू हालयात
subset-clear = पुसात
orbital-add-row = ओळ जोडात
orbital-remove-row = ओळ काडून उडयात
orbital-add-box = पेटी जोडात
orbital-remove-box = पेटी काडून उडयात
orbital-add-up-arrow = वयलो बाण जोडात
orbital-add-down-arrow = सकयलो बाण जोडात
orbital-remove-arrow = बाण काडून उडयात
orbital-row-label = ओळ { $row } खातीर नामपट्टी
pretzel-answer = जाप

## Math input

math-input-preview-region = गणिती अभिव्यक्तीची झलक
math-input-preview = झलक
math-input-invalid-expression = अवैध अभिव्यक्ती:

## Document status

viewer-initializing = सुरू जाता…

## Errors

error-heading = चूक
error-found-at =
    { $span ->
        [line] ओळ { $startLine } चेर मेळ्ळें।
       *[lines] ओळ { $startLine }–{ $endLine } चेर मेळ्ळें।
    }
document-contains-errors = ह्या दस्तावेजांत चुको आसात!
diagnostic-heading-error = चूक
diagnostic-heading-warning = शिटकावणी
diagnostic-heading-information = म्हायती
diagnostic-heading-hint = सुचोवणी
accessibility-heading-level-1 = WCAG AA सुगमताय उल्लंघन
accessibility-heading-level-2 = सुगमताय सुचोवणी
something-went-wrong = कितेंतरी चुकलें।
renderer-load-failed = एक प्रदर्शक लोड जावंक ना। उपकार करून पान परत लोड करात।
core-start-failed = दस्तावेज दर्शक सुरू जावंक ना। उपकार करून पान परत लोड करात।
