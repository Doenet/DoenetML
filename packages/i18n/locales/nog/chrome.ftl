# Nogai viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic, which is the only orthography Nogai has been printed in
# since 1938 and what CLDR fills a bare `nog` in as (`nog` maximizes to
# `nog-Cyrl-RU`). The digraphs аь, оь, уь and нъ are letters of the Nogai
# alphabet, not Russian sequences: «коьрсетуьв» is spelled with two of them and
# nothing in it may be simplified to «керсетув».
#
# Nogai counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. A noun
# after a numeral stays singular — «2 аьрекет», never a plural — so the two
# branches differ in nothing but the number they print, and the explicit `[0]`
# branch English writes is kept where English writes one.
#
# Nogai has no grammatical gender and no noun classes, so nothing in this file
# or in `content.ftl` forks on `$gender`.
#
# What this file is least sure of is its UI vocabulary. Nogai's published
# technical writing is small, and the words for interface objects a browser
# shows — a keyboard tray, a preview popover, a footnote marker, an orbital
# box — have no attested Nogai usage this seed could copy. They are built here
# from general Kipchak vocabulary («куты» for a box, «эскертпе» for a footnote,
# «алдын коьруьв» for a preview) and are the first thing a speaker should
# rewrite. The mathematical and computing terms are Russian, which is what
# written Nogai itself uses for them.


## Answer submission

answer-checking = Тексериледи…
answer-submitting = Йибериледи…
answer-checking-status = Явап тексериледи
answer-submitting-status = Явап йибериледи
answer-correct = Дурыс
answer-incorrect = Дурыс тувыл
answer-response-saved = Явап сакланды
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% дурыс
answer-percent-short = { $percent } %
max-credit-available = Алынатаган эм оьр балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] аьрекет калмады
        [one] { $count } аьрекет калды
       *[other] { $count } аьрекет калды
    }
validation-correct = (Дурыс)
validation-incorrect = (Дурыс тувыл)
validation-partially-correct = (Яртылай дурыс)
answer-show-responses =
    { $count ->
        [one] { $answerId } уьшин { $count } явапты коьрсетуьв
       *[other] { $answerId } уьшин { $count } явапты коьрсетуьв
    }

## Disclosure panels

feedback-heading = Кери байланыс
collapsible-click-to-open = (ашув уьшин басынъыз)
collapsible-click-to-close = (ябув уьшин басынъыз)
collapsible-initializing = Аьзирленеди…
footnote-show = Эскертпени коьрсетуьв
footnote-hide = Эскертпени ясырув
description-more-information = косымша малюмат

## Controls

slider-previous = Алдынгы
slider-next = Келеси
keyboard-open = Клавиатураны ашув
keyboard-close = Клавиатураны ябув
choice-input-remove-choice = { $choice } сайлавын алып таслав
matrix-remove-row = Катарды алып таслав
matrix-add-row = Катар косув
matrix-remove-column = Багананы алып таслав
matrix-add-column = Багана косув
subset-add-remove-points = Нокталар косув/алып таслав
subset-toggle-points-intervals = Нокталар мен аралыкларды авыстырув
subset-move-points = Нокталарды коьшируьв
subset-clear = Тазалав
orbital-add-row = Катар косув
orbital-remove-row = Катарды алып таслав
orbital-add-box = Куты косув
orbital-remove-box = Кутыны алып таслав
orbital-add-up-arrow = Йогары ок косув
orbital-add-down-arrow = Тоьмен ок косув
orbital-remove-arrow = Окты алып таслав
orbital-row-label = { $row } катардынъ белгиси
pretzel-answer = Явап

## Math input

math-input-preview-region = математикалык аьнълатпаны алдын коьруьв
math-input-preview = Алдын коьруьв
math-input-invalid-expression = Дурыс тувыл аьнълатпа:

## Document status

viewer-initializing = Аьзирленеди…

## Errors

error-heading = Кате
error-found-at =
    { $span ->
        [line] { $startLine } катарда табылды.
       *[lines] { $startLine }–{ $endLine } катарларда табылды.
    }
document-contains-errors = Бу документте кателер бар!
diagnostic-heading-error = Кате
diagnostic-heading-warning = Эскертуьв
diagnostic-heading-information = Малюмат
diagnostic-heading-hint = Коьрсетпе
accessibility-heading-level-1 = WCAG AA колайлык бузылувы
accessibility-heading-level-2 = Колайлык хабары
something-went-wrong = Бир зат дурыс болмады.
renderer-load-failed = коьрсетуьвши юкленмеди. Бетти янъыртынъыз.
core-start-failed = Бу документти баслап болмады. Бетти янъыртынъыз.
core-start-failed-busy = Бу документти баслап болмады. Бир заманда бир кесек документ басланган эди, ол оьзи аста аьсбапта коьбирек заман алады. Баска документлер тамамланганнан сонъ бетти янъыртув коьмек этуьви мумкин.
core-start-failed-retry = Бу документти баслап болмады.
core-start-failed-busy-retry = Бу документти баслап болмады. Бир заманда бир кесек документ басланган эди, ол оьзи аста аьсбапта коьбирек заман алады.
core-start-retry = Кайтадан баслав
saved-state-unavailable = Сакланган ислевинъизди юклеп болмады.
