# Armenian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Armenian counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. A noun
# after a numeral stays singular — «2 փորձ», not a plural — so the two branches
# differ in nothing but the number they print.
#
# Register: the second-person plural imperative — «Թարմացրեք էջը».
#
# An affix is never welded to a placeable. The definite article alternates on
# the sound before it — «-ը» after a consonant, «-ն» after a vowel — and the
# value is unknown here, so where the sentence wants a determined noun the
# article goes on a word this catalog writes («{ $attribute } ատրիբուտը»,
# «{ $action } գործողությունը») and the value stays bare. The genitive «-ի»,
# the dative «-ին», the ablative «-ից» and the locative «-ում» do not
# alternate, so those still sit directly on a value.


## Answer submission

answer-checking = Ստուգվում է…
answer-submitting = Ուղարկվում է…
answer-checking-status = Պատասխանի ստուգում
answer-submitting-status = Պատասխանի ուղարկում
answer-correct = Ճիշտ է
answer-incorrect = Սխալ է
answer-response-saved = Պատասխանը պահպանվեց
answer-percent-credit = { $percent }% միավոր
answer-percent-correct = { $percent }% ճիշտ
answer-percent-short = { $percent } %
max-credit-available = Առավելագույն հնարավոր միավորը՝ { $percent }%
attempts-remaining =
    { $count ->
        [0] փորձեր չեն մնացել
        [one] մնացել է { $count } փորձ
       *[other] մնացել է { $count } փորձ
    }
validation-correct = (Ճիշտ է)
validation-incorrect = (Սխալ է)
validation-partially-correct = (Մասամբ ճիշտ է)
answer-show-responses =
    { $count ->
        [one] Ցույց տալ { $answerId }-ի { $count } պատասխանը
       *[other] Ցույց տալ { $answerId }-ի { $count } պատասխանը
    }

## Disclosure panels

feedback-heading = Արձագանք
collapsible-click-to-open = (սեղմեք բացելու համար)
collapsible-click-to-close = (սեղմեք փակելու համար)
collapsible-initializing = Նախապատրաստվում է…
footnote-show = Ցույց տալ ծանոթագրությունը
footnote-hide = Թաքցնել ծանոթագրությունը
description-more-information = լրացուցիչ տեղեկություն

## Controls

slider-previous = Նախորդը
slider-next = Հաջորդը
keyboard-open = Բացել ստեղնաշարը
keyboard-close = Փակել ստեղնաշարը
choice-input-remove-choice = Հեռացնել { $choice }
matrix-remove-row = Հեռացնել տողը
matrix-add-row = Ավելացնել տող
matrix-remove-column = Հեռացնել սյունը
matrix-add-column = Ավելացնել սյուն
subset-add-remove-points = Ավելացնել/հեռացնել կետեր
subset-toggle-points-intervals = Փոխարկել կետերի և միջակայքերի միջև
subset-move-points = Տեղափոխել կետերը
subset-clear = Մաքրել
orbital-add-row = Ավելացնել տող
orbital-remove-row = Հեռացնել տողը
orbital-add-box = Ավելացնել վանդակ
orbital-remove-box = Հեռացնել վանդակը
orbital-add-up-arrow = Ավելացնել վերև սլաք
orbital-add-down-arrow = Ավելացնել ներքև սլաք
orbital-remove-arrow = Հեռացնել սլաքը
orbital-row-label = { $row } տողի պիտակը
pretzel-answer = Պատասխան

## Math input

math-input-preview-region = մաթեմատիկական արտահայտության նախադիտում
math-input-preview = Նախադիտում
math-input-invalid-expression = Անվավեր արտահայտություն՝

## Document status

viewer-initializing = Նախապատրաստվում է…

## Errors

error-heading = Սխալ
error-found-at =
    { $span ->
        [line] Հայտնաբերվել է { $startLine } տողում։
       *[lines] Հայտնաբերվել է { $startLine }–{ $endLine } տողերում։
    }
document-contains-errors = Այս փաստաթուղթը սխալներ է պարունակում։
diagnostic-heading-error = Սխալ
diagnostic-heading-warning = Զգուշացում
diagnostic-heading-information = Տեղեկություն
diagnostic-heading-hint = Հուշում
accessibility-heading-level-1 = WCAG AA մատչելիության խախտում
accessibility-heading-level-2 = Մատչելիության ծանուցում
something-went-wrong = Ինչ-որ բան սխալ գնաց։
renderer-load-failed = պատկերիչը չհաջողվեց բեռնել։ Թարմացրեք էջը։
core-start-failed = Փաստաթղթի դիտիչը չհաջողվեց գործարկել։ Թարմացրեք էջը։
