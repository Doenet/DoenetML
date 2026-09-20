# Wolof viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# CLDR gives Wolof one plural category, and it is right to: number is marked on
# the determiner and the class linker — «xët bi», «xët yi» — and the noun and
# the numeral beside it do not change shape. So the counted messages drop their
# selects, and a `[one]` differing from its `[other]` would be wrong rather
# than merely redundant. `attempts-remaining` keeps its `[0]` branch, which is
# an exact-value match rather than a plural category and says «amul» instead of
# counting to zero.


## Answer submission

answer-checking = Mu ngi seetlu...
answer-submitting = Mu ngi yónnee...
answer-checking-status = Mu ngi seetlu tontu bi
answer-submitting-status = Mu ngi yónnee tontu bi
answer-correct = Baax na
answer-incorrect = Baaxul
answer-response-saved = Tontu bi Denc Nañu ko
answer-percent-credit = { $percent }% Njariñ
answer-percent-correct = { $percent }% Baax na
answer-percent-short = { $percent } %
max-credit-available = Njariñ gi gën a kawe: { $percent }%
attempts-remaining =
    { $count ->
        [0] amul jéego bu des
       *[other] { $count } jéego a des
    }
validation-correct = (Baax na)
validation-incorrect = (Baaxul)
validation-partially-correct = (Baax na ci lenn)
answer-show-responses = Wone { $count } tontu ci { $answerId }

## Disclosure panels

feedback-heading = Ndigal
collapsible-click-to-open = (bësal ngir ubbi)
collapsible-click-to-close = (bësal ngir tëj)
collapsible-initializing = Mu ngi tàmbali...
footnote-show = Wone nataalu suuf
footnote-hide = Nëbb nataalu suuf
description-more-information = xibaar yu gën a bare

## Controls

slider-previous = Bi jiitu
slider-next = Bi ci topp
keyboard-open = Ubbi Klaawiye bi
keyboard-close = Tëj Klaawiye bi
choice-input-remove-choice = Dindi { $choice }
matrix-remove-row = Dindi ab rëdd
matrix-add-row = Yokk ab rëdd
matrix-remove-column = Dindi ab poto
matrix-add-column = Yokk ab poto
subset-add-remove-points = Yokk/Dindi ay poñ
subset-toggle-points-intervals = Soppi diggante poñ ak enterwal
subset-move-points = Toxal Poñ yi
subset-clear = Far
# A `box` here is one orbital, drawn as a square: «kees».
orbital-add-row = Yokk Rëdd
orbital-remove-row = Dindi Rëdd
orbital-add-box = Yokk Kees
orbital-remove-box = Dindi Kees
orbital-add-up-arrow = Yokk Fetal bu Kaw
orbital-add-down-arrow = Yokk Fetal bu Suuf
orbital-remove-arrow = Dindi Fetal
orbital-row-label = Turu rëdd { $row }
pretzel-answer = Tontu

## Math input

math-input-preview-region = wonewaatu ekspresiyoŋu matematik
math-input-preview = Wonewaat
math-input-invalid-expression = Ekspresiyoŋ bi baaxul:

## Document status

viewer-initializing = Mu ngi tàmbali...

## Errors

error-heading = Njumte
error-found-at =
    { $span ->
        [line] Gis nañu ko ci rëdd { $startLine }.
       *[lines] Gis nañu ko ci rëdd { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokimaan bii am na ay njumte!
diagnostic-heading-error = Njumte
diagnostic-heading-warning = Artu
diagnostic-heading-information = Xibaar
diagnostic-heading-hint = Xelal
accessibility-heading-level-1 = Moytu Jotewaay bu WCAG AA
accessibility-heading-level-2 = Artu ci jotewaay
something-went-wrong = Am na lu demul ni mu ware.
renderer-load-failed = benn wonekaay yeggul. Nga jëmmali xët bi.
core-start-failed = Wonekaayu dokimaan bi mënul tàmbali. Nga jëmmali xët bi.
