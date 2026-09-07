# Chichewa viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Chichewa has two plural categories, and a noun marks number with a class
# prefix rather than a suffix: «choyesa chimodzi», «zoyesa zisanu». So the
# selects are kept and the noun changes shape inside them.


## Answer submission

answer-checking = Ikuyang'ana...
answer-submitting = Ikutumiza...
answer-checking-status = Ikuyang'ana yankho
answer-submitting-status = Ikutumiza yankho
answer-correct = Zolondola
answer-incorrect = Zolakwika
answer-response-saved = Yankho Lasungidwa
answer-percent-credit = Mfundo { $percent }%
answer-percent-correct = { $percent }% Zolondola
answer-percent-short = { $percent }%
max-credit-available = Mfundo zapamwamba zopezeka: { $percent }%
attempts-remaining =
    { $count ->
        [0] palibe zoyesa zotsala
        [one] chatsala choyesa { $count }
       *[other] zatsala zoyesa { $count }
    }
validation-correct = (Zolondola)
validation-incorrect = (Zolakwika)
validation-partially-correct = (Zolondola pang'ono)
answer-show-responses =
    { $count ->
        [one] Onetsani yankho { $count } la { $answerId }
       *[other] Onetsani mayankho { $count } a { $answerId }
    }

## Disclosure panels

feedback-heading = Ndemanga
collapsible-click-to-open = (dinani kuti mutsegule)
collapsible-click-to-close = (dinani kuti mutseke)
collapsible-initializing = Ikuyamba...
footnote-show = Onetsani chidziwitso chapansi
footnote-hide = Bisani chidziwitso chapansi
description-more-information = zambiri

## Controls

slider-previous = M'mbuyo
slider-next = Kutsogolo
keyboard-open = Tsegulani Kiyibodi
keyboard-close = Tsekani Kiyibodi
choice-input-remove-choice = Chotsani { $choice }
matrix-remove-row = Chotsani mzere
matrix-add-row = Onjezani mzere
matrix-remove-column = Chotsani ndime
matrix-add-column = Onjezani ndime
subset-add-remove-points = Onjezani/Chotsani mfundo
subset-toggle-points-intervals = Sinthani pakati pa mfundo ndi mipata
subset-move-points = Sunthani Mfundo
subset-clear = Fufutani
# A `box` here is one orbital, drawn as a square: bokosi.
orbital-add-row = Onjezani Mzere
orbital-remove-row = Chotsani Mzere
orbital-add-box = Onjezani Bokosi
orbital-remove-box = Chotsani Bokosi
orbital-add-up-arrow = Onjezani Muvi Wopita M'mwamba
orbital-add-down-arrow = Onjezani Muvi Wopita Pansi
orbital-remove-arrow = Chotsani Muvi
orbital-row-label = Chizindikiro cha mzere { $row }
pretzel-answer = Yankho

## Math input

math-input-preview-region = chiwonetsero cha mawu a masamu
math-input-preview = Chiwonetsero
math-input-invalid-expression = Mawu olakwika:

## Document status

viewer-initializing = Ikuyamba...

## Errors

error-heading = Cholakwika
error-found-at =
    { $span ->
        [line] Chapezeka pa mzere { $startLine }.
       *[lines] Chapezeka pa mizere { $startLine }–{ $endLine }.
    }
document-contains-errors = Chikalata ichi chili ndi zolakwika!
diagnostic-heading-error = Cholakwika
diagnostic-heading-warning = Chenjezo
diagnostic-heading-information = Chidziwitso
diagnostic-heading-hint = Chithandizo
accessibility-heading-level-1 = Kuphwanya Kupezeka kwa WCAG AA
accessibility-heading-level-2 = Chenjezo la kupezeka
something-went-wrong = Pali chinachake chomwe sichinayende bwino.
renderer-load-failed = chiwonetsero china sichinathe kutsitsidwa. Chonde tsitsaninso tsamba.
core-start-failed = Chiwonetsero cha chikalata sichinathe kuyambitsidwa. Chonde tsitsaninso tsamba.
