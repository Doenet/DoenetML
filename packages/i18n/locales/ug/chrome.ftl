# Uyghur viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: impersonal throughout — a control is named by a verbal noun
# («قۇر قوشۇش», not «قۇر قوشۇڭ»), so nothing here has to choose how formally a
# deployment addresses its readers.
#
# Uyghur counts in two categories, and `other` covers zero as well as
# everything above one, so a message wanting a separate wording for none says
# `[0]` by number, as the English does. Elsewhere the count needs no branch: a
# Uyghur noun after a numeral stays singular, so one form counts everything.


## Answer submission

answer-checking = تەكشۈرۈۋاتىدۇ...
answer-submitting = يوللاۋاتىدۇ...
answer-checking-status = جاۋاب تەكشۈرۈلۈۋاتىدۇ
answer-submitting-status = جاۋاب يوللىنىۋاتىدۇ
answer-correct = توغرا
answer-incorrect = خاتا
answer-response-saved = جاۋاب ساقلاندى
answer-percent-credit = { $percent }% نومۇر
answer-percent-correct = { $percent }% توغرا
answer-percent-short = { $percent }%
max-credit-available = ئەڭ يۇقىرى ئېرىشكىلى بولىدىغان نومۇر: { $percent }%
attempts-remaining =
    { $count ->
        [0] سىناش پۇرسىتى قالمىدى
       *[other] { $count } سىناش پۇرسىتى قالدى
    }
validation-correct = (توغرا جاۋاب)
validation-incorrect = (خاتا جاۋاب)
validation-partially-correct = (قىسمەن توغرا جاۋاب)
answer-show-responses = { $answerId } غا يوللانغان { $count } جاۋابنى كۆرسىتىش

## Disclosure panels

feedback-heading = ئىنكاس
collapsible-click-to-open = (ئېچىش ئۈچۈن چېكىش)
collapsible-click-to-close = (يېپىش ئۈچۈن چېكىش)
collapsible-initializing = تەييارلىنىۋاتىدۇ...
footnote-show = بەت ئىزاھاتىنى كۆرسىتىش
footnote-hide = بەت ئىزاھاتىنى يوشۇرۇش
description-more-information = تېخىمۇ كۆپ ئۇچۇر

## Controls

slider-previous = ئالدىنقى
slider-next = كېيىنكى
keyboard-open = ھەرپتاختىنى ئېچىش
keyboard-close = ھەرپتاختىنى يېپىش
# The accusative «نى» is written detached after the placeable, as it is after
# `{ $shortcut }` in `editor.ftl` and as Uyghur writes a case ending against a
# foreign word. `$choice` is the choice's own text, in whatever language the
# document is written in, so it is exactly that case.
choice-input-remove-choice = { $choice } نى ئۆچۈرۈش
matrix-remove-row = قۇر ئۆچۈرۈش
matrix-add-row = قۇر قوشۇش
matrix-remove-column = ئىستون ئۆچۈرۈش
matrix-add-column = ئىستون قوشۇش
subset-add-remove-points = نۇقتا قوشۇش/ئۆچۈرۈش
subset-toggle-points-intervals = نۇقتا بىلەن ئارىلىق ئارىسىدا ئالماشتۇرۇش
subset-move-points = نۇقتىلارنى يۆتكەش
subset-clear = تازىلاش
orbital-add-row = قۇر قوشۇش
orbital-remove-row = قۇر ئۆچۈرۈش
orbital-add-box = رامكا قوشۇش
orbital-remove-box = رامكا ئۆچۈرۈش
orbital-add-up-arrow = ئۈستىگە قارىغان يا ئوق قوشۇش
orbital-add-down-arrow = ئاستىغا قارىغان يا ئوق قوشۇش
orbital-remove-arrow = يا ئوق ئۆچۈرۈش
orbital-row-label = { $row } - قۇرنىڭ ئىسمى
pretzel-answer = جاۋاب

## Math input

math-input-preview-region = ماتېماتىكىلىق ئىپادىنىڭ ئالدىن كۆرۈنۈشى
math-input-preview = ئالدىن كۆرۈش
math-input-invalid-expression = ئىناۋەتسىز ئىپادە:

## Document status

viewer-initializing = تەييارلىنىۋاتىدۇ...

## Errors

error-heading = خاتالىق
error-found-at =
    { $span ->
        [line] { $startLine } - قۇردا بايقالدى.
       *[lines] { $startLine } - { $endLine } قۇرلاردا بايقالدى.
    }
document-contains-errors = بۇ ھۆججەتتە خاتالىق بار!
# Headings of the tooltip the editor shows over a squiggle.
diagnostic-heading-error = خاتالىق
diagnostic-heading-warning = ئاگاھلاندۇرۇش
diagnostic-heading-information = ئۇچۇر
diagnostic-heading-hint = كۆرسەتمە
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = WCAG AA بويىچە زىيارەت قۇلايلىقى بۇزۇلۇشى
accessibility-heading-level-2 = زىيارەت قۇلايلىقى ئەسكەرتىشى
something-went-wrong = بىر يەردە خاتالىق كۆرۈلدى.
# Follows `error-heading` and a colon.
renderer-load-failed = بىر بۆلەك يۈكلەنمىدى. بەتنى قايتا يۈكلەش كېرەك.
core-start-failed = ھۆججەت كۆرگۈچنى قوزغاتقىلى بولمىدى. بەتنى قايتا يۈكلەش كېرەك.
