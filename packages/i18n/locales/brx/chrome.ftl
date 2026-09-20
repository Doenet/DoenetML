# Bodo viewer chrome: buttons, panel headers, and other UI the reader interacts
# with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Written in Devanagari; see `content.ftl`'s header for the script note and for
# the two vocabulary decisions a speaker should check first.


## Answer submission

answer-checking = आनजाद खालामगासिनो दं…
answer-submitting = दैथायगासिनो दं…
answer-checking-status = फिनखौ आनजाद खालामगासिनो दं
answer-submitting-status = फिनखौ दैथायगासिनो दं
answer-correct = थार
answer-incorrect = गोरोन्थि
answer-response-saved = फिनखौ थिना दोनबाय
answer-percent-credit = { $percent }% नम्बर
answer-percent-correct = { $percent }% थार
answer-percent-short = { $percent } %
max-credit-available = मोनथाव गोबाव नम्बर: { $percent }%
attempts-remaining =
    { $count ->
        [0] जेबो नाजाथाय गैया
        [one] { $count } नाजाथाय दंफैदं
       *[other] { $count } नाजाथाय दंफैदं
    }
validation-correct = (थार)
validation-incorrect = (गोरोन्थि)
validation-partially-correct = (बाहागोजों थार)
answer-show-responses =
    { $count ->
        [one] { $answerId }नि थाखाय { $count } फिन दिन्थि
       *[other] { $answerId }नि थाखाय { $count } फिन दिन्थि
    }

## Disclosure panels

feedback-heading = फिननाय
collapsible-click-to-open = (खेवनो क्लिक खालाम)
collapsible-click-to-close = (बन्द खालामनो क्लिक खालाम)
collapsible-initializing = जागायगासिनो दं…
footnote-show = आथिं टिप्पनी दिन्थि
footnote-hide = आथिं टिप्पनी एरसुं
description-more-information = गोबाव फोरमायथिहोग्रा

## Controls

slider-previous = आगोलनि
slider-next = उननि
keyboard-open = कि-बोर्ड खेव
keyboard-close = कि-बोर्ड बन्द खालाम
choice-input-remove-choice = { $choice } बोखार
matrix-remove-row = सारि बोखार
matrix-add-row = सारि दाजाब
matrix-remove-column = खाम्फा बोखार
matrix-add-column = खाम्फा दाजाब
subset-add-remove-points = बिन्दु दाजाब/बोखार
subset-toggle-points-intervals = बिन्दु आरो अन्तराल सोलाय
subset-move-points = बिन्दु सोलाय दिहुन
subset-clear = हुखुमार
orbital-add-row = सारि दाजाब
orbital-remove-row = सारि बोखार
orbital-add-box = बाक्सा दाजाब
orbital-remove-box = बाक्सा बोखार
orbital-add-up-arrow = गोजौथिं थिर दाजाब
orbital-add-down-arrow = गाहायथिं थिर दाजाब
orbital-remove-arrow = थिर बोखार
orbital-row-label = सारि { $row }नि लेबेल
pretzel-answer = फिन

## Math input

math-input-preview-region = गणित बाथ्रानि सिगांथिं नुथाय
math-input-preview = सिगांथिं नुथाय
math-input-invalid-expression = गोरोन्थि बाथ्रा:

## Document status

viewer-initializing = जागायगासिनो दं…

## Errors

error-heading = गोरोन्थि
error-found-at =
    { $span ->
        [line] सारि { $startLine }आव मोनखांबाय।
       *[lines] सारि { $startLine }–{ $endLine }आव मोनखांबाय।
    }
document-contains-errors = बे दस्ताबेजआव गोरोन्थि दं!
diagnostic-heading-error = गोरोन्थि
diagnostic-heading-warning = सांग्रांथि
diagnostic-heading-information = फोरमायथिहोग्रा
diagnostic-heading-hint = सिनायथि
accessibility-heading-level-1 = WCAG AA मोनथाव जायगानि गोरोन्थि
accessibility-heading-level-2 = मोनथाव जायगानि सांग्रांथि
something-went-wrong = माबा गोरोन्थि जाबाय।
renderer-load-failed = मोनसे दिन्थिग्रा लोड जाया। अननानै बिलाइखौ फिन लोड खालाम।
core-start-failed = दस्ताबेज नुग्रा जागायनो हाया। अननानै बिलाइखौ फिन लोड खालाम।
