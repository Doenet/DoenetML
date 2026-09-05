# Tabasaran viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic orthography of the Tabasaran literary language, the
# standard Dagestan's Tabasaran-medium schooling and the Tabasaran press use.
# The palochka Ӏ is a letter: not a Latin capital I, not a digit 1.
#
# `Intl.PluralRules("tab")` reports `one` and `other`, so every
# `{ $count -> … }` below keeps the two branches English gives it. A Tabasaran
# noun after a numeral stays in the singular, so the two branches differ in
# nothing but the number they print — that is correct and not a copy-paste
# slip.
#
# Nothing in this file agrees with a noun class. Tabasaran does have a human /
# non-human distinction, but it is carried by numerals, by the verb and by a
# few pronouns, none of which these messages reach; `content.ftl`'s header sets
# out why that means no message in this catalog forks.
#
# Where a value is followed by a word that would take a case ending, the ending
# is put on a noun this file writes — «бадали» after `{ $answerId }`,
# «сутундин» after `{ $column }` — rather than welded onto the placeable.
#
# Least certain here: «хъуркьувал» for accessibility is a coinage off
# «хъуркьуб» (to reach) rather than a term this seed could attest, and the
# words around the buttons («клик апӀин», «элаве апӀуб», «адагъуб») are the
# everyday verbs a speaker will most want to look at first.


## Answer submission

answer-checking = Ахтармиш апӀура…
answer-submitting = Ивура…
answer-checking-status = Жаваб ахтармиш апӀура
answer-submitting-status = Жаваб ивура
answer-correct = Дюз
answer-incorrect = Дюз дар
answer-response-saved = Жаваб уьбхна
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% дюз
answer-percent-short = { $percent } %
max-credit-available = Максималлу балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] гьяракатар гъузнадар
        [one] { $count } гьяракат гъузна
       *[other] { $count } гьяракат гъузна
    }
validation-correct = (Дюз)
validation-incorrect = (Дюз дар)
validation-partially-correct = (Са пай дюз)
answer-show-responses =
    { $count ->
        [one] { $answerId } бадали { $count } жаваб улупуб
       *[other] { $answerId } бадали { $count } жаваб улупуб
    }

## Disclosure panels

feedback-heading = Фикир
collapsible-click-to-open = (ачмиш апӀуз клик апӀин)
collapsible-click-to-close = (багъламиш апӀуз клик апӀин)
collapsible-initializing = Гьязур шула…
footnote-show = Сноска улупуб
footnote-hide = Сноска гизлемиш апӀуб
description-more-information = артухъ мялумат

## Controls

slider-previous = Улихьна
slider-next = Кьяляхъна
keyboard-open = Клавиатура ачмиш апӀуб
keyboard-close = Клавиатура багъламиш апӀуб
choice-input-remove-choice = { $choice } адагъуб
matrix-remove-row = Жерге адагъуб
matrix-add-row = Жерге элаве апӀуб
matrix-remove-column = Сутун адагъуб
matrix-add-column = Сутун элаве апӀуб
subset-add-remove-points = НукьтӀйир элаве апӀуб/адагъуб
subset-toggle-points-intervals = НукьтӀйир ва интервалар дегиш апӀуб
subset-move-points = НукьтӀйир гъахуб
subset-clear = Марцц апӀуб
orbital-add-row = Жерге элаве апӀуб
orbital-remove-row = Жерге адагъуб
orbital-add-box = Клетка элаве апӀуб
orbital-remove-box = Клетка адагъуб
orbital-add-up-arrow = Зиина стрелка элаве апӀуб
orbital-add-down-arrow = КӀанди стрелка элаве апӀуб
orbital-remove-arrow = Стрелка адагъуб
orbital-row-label = { $row } жергейин лишан
pretzel-answer = Жаваб

## Math input

math-input-preview-region = математический ифада улихьди лигуб
math-input-preview = Улихьди лигуб
math-input-invalid-expression = Дюз дару ифада:

## Document status

viewer-initializing = Гьязур шула…

## Errors

error-heading = ГъалатӀ
error-found-at =
    { $span ->
        [line] Жерге: { $startLine }.
       *[lines] Жергйир: { $startLine }–{ $endLine }.
    }
document-contains-errors = Му документиъ гъалатӀар а!
diagnostic-heading-error = ГъалатӀ
diagnostic-heading-warning = Хабардар
diagnostic-heading-information = Мялумат
diagnostic-heading-hint = Меслят
accessibility-heading-level-1 = WCAG AA хъуркьувалин нарушение
accessibility-heading-level-2 = Хъуркьувалин хабардар
something-went-wrong = Са зат дюз гъабхьундар.
renderer-load-failed = рендерер гъюз гъабхьундар. Ччин цӀийи апӀин.
core-start-failed = Му документ ккебгъуз гъабхьундар. Ччин цӀийи апӀин.
core-start-failed-busy = Му документ ккебгъуз гъабхьундар. Са вахтна гизаф документар ккебгъурайи, зяиф аьлетдиин думу гизаф вахт гъадабгъуру. Жара документар ккудубкӀган ччин цӀийи апӀуб кюмек апӀиди.
core-start-failed-retry = Му документ ккебгъуз гъабхьундар.
core-start-failed-busy-retry = Му документ ккебгъуз гъабхьундар. Са вахтна гизаф документар ккебгъурайи, зяиф аьлетдиин думу гизаф вахт гъадабгъуру.
core-start-retry = Мадсана гьяракат апӀуб
saved-state-unavailable = Уву уьбхнайи ляхин гъадагъуз гъабхьундар.
