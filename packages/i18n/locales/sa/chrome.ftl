# Sanskrit viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Written in Devanagari; see `content.ftl`'s header for why that is the one
# script of the many Sanskrit is written in that this catalog uses, and for the
# sandhi rule every join across a placeable follows.
#
# Buttons are imperatives, which is what Sanskrit prose addressed to a reader
# uses and what keeps them short enough for a toolbar.


## Answer submission

answer-checking = परीक्ष्यते…
answer-submitting = प्रेष्यते…
answer-checking-status = उत्तरं परीक्ष्यते
answer-submitting-status = उत्तरं प्रेष्यते
answer-correct = शुद्धम्
answer-incorrect = अशुद्धम्
answer-response-saved = उत्तरं रक्षितम्
answer-percent-credit = { $percent }% अङ्काः
answer-percent-correct = { $percent }% शुद्धम्
answer-percent-short = { $percent } %
max-credit-available = उपलब्धाः अधिकतमाः अङ्काः: { $percent }%
# Sanskrit leaves a noun singular after a numeral far less readily than the
# modern languages beside it do, but it also has a dual this catalog cannot
# reach: `Intl.PluralRules` has no Sanskrit data and reports the English
# two-category rule, so a count of two selects `other`. The wording is chosen
# to be right for both — «अवशिष्टाः प्रयत्नाः» reads correctly of two as of ten.
attempts-remaining =
    { $count ->
        [0] न कोऽपि प्रयत्नः अवशिष्टः
        [one] { $count } प्रयत्नः अवशिष्टः
       *[other] { $count } प्रयत्नाः अवशिष्टाः
    }
validation-correct = (शुद्धम्)
validation-incorrect = (अशुद्धम्)
validation-partially-correct = (आंशिकतया शुद्धम्)
answer-show-responses =
    { $count ->
        [one] { $answerId }-कृते { $count } उत्तरं दर्श्यताम्
       *[other] { $answerId }-कृते { $count } उत्तराणि दर्श्यन्ताम्
    }

## Disclosure panels

feedback-heading = प्रतिपुष्टिः
collapsible-click-to-open = (उद्घाटनाय नुद्यताम्)
collapsible-click-to-close = (पिधानाय नुद्यताम्)
collapsible-initializing = आरभ्यते…
footnote-show = पादटिप्पणी दर्श्यताम्
footnote-hide = पादटिप्पणी गोप्यताम्
description-more-information = अधिका सूचना

## Controls

slider-previous = पूर्वम्
slider-next = अग्रिमम्
keyboard-open = कुञ्जीपटलम् उद्घाट्यताम्
keyboard-close = कुञ्जीपटलं पिधीयताम्
choice-input-remove-choice = { $choice } अपनीयताम्
matrix-remove-row = पङ्क्तिः अपनीयताम्
matrix-add-row = पङ्क्तिः योज्यताम्
matrix-remove-column = स्तम्भः अपनीयताम्
matrix-add-column = स्तम्भः योज्यताम्
subset-add-remove-points = बिन्दवः योज्यन्ताम् अपनीयन्तां वा
subset-toggle-points-intervals = बिन्दवः अन्तरालाश्च परिवर्त्यन्ताम्
subset-move-points = बिन्दवः चाल्यन्ताम्
subset-clear = मार्ज्यताम्
orbital-add-row = पङ्क्तिः योज्यताम्
orbital-remove-row = पङ्क्तिः अपनीयताम्
orbital-add-box = पेटिका योज्यताम्
orbital-remove-box = पेटिका अपनीयताम्
orbital-add-up-arrow = ऊर्ध्वबाणः योज्यताम्
orbital-add-down-arrow = अधोबाणः योज्यताम्
orbital-remove-arrow = बाणः अपनीयताम्
orbital-row-label = { $row } पङ्क्तेः नामाङ्कनम्
pretzel-answer = उत्तरम्

## Math input

math-input-preview-region = गणितीयव्यञ्जनस्य पूर्वावलोकनम्
math-input-preview = पूर्वावलोकनम्
math-input-invalid-expression = अमान्यं व्यञ्जनम्:

## Document status

viewer-initializing = आरभ्यते…

## Errors

error-heading = दोषः
error-found-at =
    { $span ->
        [line] { $startLine } पङ्क्तौ प्राप्तः।
       *[lines] { $startLine }–{ $endLine } पङ्क्तिषु प्राप्तः।
    }
document-contains-errors = अस्मिन् लेखे दोषाः सन्ति!
diagnostic-heading-error = दोषः
diagnostic-heading-warning = सावधानम्
diagnostic-heading-information = सूचना
diagnostic-heading-hint = सङ्केतः
# `WCAG AA` is the name of the standard and is left as it stands.
accessibility-heading-level-1 = WCAG AA सुगम्यताभङ्गः
accessibility-heading-level-2 = सुगम्यतासूचना
something-went-wrong = किमपि विपरीतं जातम्।
renderer-load-failed = प्रदर्शकः आनेतुं न शक्तः। कृपया पृष्ठं पुनः लोड्यताम्।
core-start-failed = लेखदर्शकः आरब्धुं न शक्तः। कृपया पृष्ठं पुनः लोड्यताम्।
