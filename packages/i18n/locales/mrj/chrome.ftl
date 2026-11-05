# Hill Mari viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `mrj` is Hill Mari — Western Mari in CLDR's English, кырык мары йӹлмӹ to its
# own speakers — the western literary standard of the Mari macrolanguage,
# written in Cyrillic with ӓ and ӹ, two letters Meadow Mari does not use at
# all. See `content.ftl`'s header for why this is a catalog of its own rather
# than a spelling of `locales/mhr`.
#
# Hill Mari counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.


## Answer submission

answer-checking = Тергӓлтеш…
answer-submitting = Колталтеш…
answer-checking-status = Вашмут тергӓлтеш
answer-submitting-status = Вашмут колталтеш
answer-correct = Цын
answer-incorrect = Цын агыл
answer-response-saved = Вашмут переген кодалтын
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% цын
answer-percent-short = { $percent } %
max-credit-available = Нӓлӓш лишӹ сек кого балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] цацымаш кодын агыл
        [one] { $count } цацымаш кодын
       *[other] { $count } цацымаш кодын
    }
validation-correct = (Цын)
validation-incorrect = (Цын агыл)
validation-partially-correct = (Ужашын цын)
answer-show-responses =
    { $count ->
        [one] { $answerId } вӹкӹ { $count } вашмутым анжыкташ
       *[other] { $answerId } вӹкӹ { $count } вашмутым анжыкташ
    }

## Disclosure panels

feedback-heading = Мӧҥгеш каласымаш
collapsible-click-to-open = (пачаш темдӓл)
collapsible-click-to-close = (питӹраш темдӓл)
collapsible-initializing = Йӓмдӹлӓлтеш…
footnote-show = Пӓлемдӹмӓшым анжыкташ
footnote-hide = Пӓлемдӹмӓшым шылташ
description-more-information = ешӓртыш увер

## Controls

slider-previous = Анзыцшы
slider-next = Вес
keyboard-open = Клавиатурым пачаш
keyboard-close = Клавиатурым питӹраш
choice-input-remove-choice = { $choice } айырымашым карангдаш
matrix-remove-row = Рӓдӹм карангдаш
matrix-add-row = Рӓдӹм ешӓраш
matrix-remove-column = Меҥгым карангдаш
matrix-add-column = Меҥгым ешӓраш
subset-add-remove-points = Тӧчкӓм ешӓраш/карангдаш
subset-toggle-points-intervals = Тӧчкӓ дӓ кокласым вашталташ
subset-move-points = Тӧчкӓ-влӓм вашталтен пиштӓш
subset-clear = Ӹрӹктӓш
orbital-add-row = Рӓдӹм ешӓраш
orbital-remove-row = Рӓдӹм карангдаш
orbital-add-box = Клеткӹм ешӓраш
orbital-remove-box = Клеткӹм карангдаш
orbital-add-up-arrow = Кӱшкӹ пикшым ешӓраш
orbital-add-down-arrow = Ӱлӹкӹ пикшым ешӓраш
orbital-remove-arrow = Пикшым карангдаш
orbital-row-label = { $row } рӓдӹн пӓлӹжӹ
pretzel-answer = Вашмут

## Math input

math-input-preview-region = математический попымашын анзыц анжымашыжӹ
math-input-preview = Анзыц анжымаш
math-input-invalid-expression = Цын агыл попымаш:

## Document status

viewer-initializing = Йӓмдӹлӓлтеш…

## Errors

error-heading = Йоҥылыш
error-found-at =
    { $span ->
        [line] Момы рӓдӹ: { $startLine }.
       *[lines] Момы рӓдӹ-влӓ: { $startLine }–{ $endLine }.
    }
document-contains-errors = Тидӹ документӹштӹ йоҥылыш-влӓ ылыт!
diagnostic-heading-error = Йоҥылыш
diagnostic-heading-warning = Шижтӓрӹмӓш
diagnostic-heading-information = Увер
diagnostic-heading-hint = Ой
accessibility-heading-level-1 = WCAG AA шон кердмӓшын пыдыртымашыжӹ
accessibility-heading-level-2 = Шон кердмӓш гишӓн увер
something-went-wrong = Ала-ма цын агыл ли.
renderer-load-failed = сӱретӹзым нӓлӓш ӹш ли. Ластыкым угӹцемдӹ.
core-start-failed = Документым анжышым цӱктӓш ӹш ли. Ластыкым угӹцемдӹ.

core-start-failed-busy = Тидӹ документым цӱктӓш ӹш ли. Иктӹ жеп доно шукы документ цӱкталтын, а лӹвӓлнӹшӹ приборышты тидӹ кужыракын кеӓ. Вес документвлӓ цӱкталт шоат гӹнь, ластыкым угӹцемдӹмӓш палшен кердеш.
core-start-failed-retry = Тидӹ документым цӱктӓш ӹш ли.
core-start-failed-busy-retry = Тидӹ документым цӱктӓш ӹш ли. Иктӹ жеп доно шукы документ цӱкталтын, а лӹвӓлнӹшӹ приборышты тидӹ кужыракын кеӓ.
core-start-retry = Эче иктӹ гӓнӓ
saved-state-unavailable = Переген кодымы пӓшӓм нӓлӓш ӹш ли.
