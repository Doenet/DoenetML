# Meadow Mari viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Meadow Mari**, the larger of the two Mari literary standards. The directory
# is named `mhr` rather than the macrolanguage `chm` because Hill Mari ships
# beside it as `locales/mrj`; `negotiate.ts` aliases `chm` onto `mhr`, so a
# document written with either tag reaches this catalog. See
# `locales/mhr/content.ftl` for the full note.
#
# Meadow Mari counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.


## Answer submission

answer-checking = Тергалтеш…
answer-submitting = Колталтеш…
answer-checking-status = Вашмут тергалтеш
answer-submitting-status = Вашмут колталтеш
answer-correct = Чын
answer-incorrect = Чын огыл
answer-response-saved = Вашмут аралалте
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% чын
answer-percent-short = { $percent } %
max-credit-available = Налаш лийше эн кугу балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] тӧчымаш кодын огыл
        [one] { $count } тӧчымаш кодын
       *[other] { $count } тӧчымаш кодын
    }
validation-correct = (Чын)
validation-incorrect = (Чын огыл)
validation-partially-correct = (Ужашын чын)
answer-show-responses =
    { $count ->
        [one] { $answerId } ӱмбак { $count } вашмутым ончыкташ
       *[other] { $answerId } ӱмбак { $count } вашмутым ончыкташ
    }

## Disclosure panels

feedback-heading = Мӧҥгеш каласымаш
collapsible-click-to-open = (почаш темдал)
collapsible-click-to-close = (петыраш темдал)
collapsible-initializing = Ямдылалтеш…
footnote-show = Палемдымашым ончыкташ
footnote-hide = Палемдымашым шылташ
description-more-information = ешартыш увер

## Controls

slider-previous = Ончычсо
slider-next = Вес
keyboard-open = Клавиатурым почаш
keyboard-close = Клавиатурым петыраш
choice-input-remove-choice = { $choice } ойырымашым кораҥдаш
matrix-remove-row = Радамым кораҥдаш
matrix-add-row = Радамым ешараш
matrix-remove-column = Меҥгым кораҥдаш
matrix-add-column = Меҥгым ешараш
subset-add-remove-points = Точкым ешараш/кораҥдаш
subset-toggle-points-intervals = Точко ден кокласым вашталташ
subset-move-points = Точко-влакым кусараш
subset-clear = Эрыкташ
orbital-add-row = Радамым ешараш
orbital-remove-row = Радамым кораҥдаш
orbital-add-box = Клеткым ешараш
orbital-remove-box = Клеткым кораҥдаш
orbital-add-up-arrow = Кӱшкӧ пикшым ешараш
orbital-add-down-arrow = Ӱлыкӧ пикшым ешараш
orbital-remove-arrow = Пикшым кораҥдаш
orbital-row-label = { $row } радамын палыже
pretzel-answer = Вашмут

## Math input

math-input-preview-region = математический ойлымашын ончылгоч ончымашыже
math-input-preview = Ончылгоч ончымаш
math-input-invalid-expression = Чын огыл ойлымаш:

## Document status

viewer-initializing = Ямдылалтеш…

## Errors

error-heading = Йоҥылыш
error-found-at =
    { $span ->
        [line] Муымо радам: { $startLine }.
       *[lines] Муымо радам-влак: { $startLine }–{ $endLine }.
    }
document-contains-errors = Тиде документыште йоҥылыш-влак улыт!
diagnostic-heading-error = Йоҥылыш
diagnostic-heading-warning = Шижтарымаш
diagnostic-heading-information = Увер
diagnostic-heading-hint = Ой
accessibility-heading-level-1 = WCAG AA шуын кертмашын пудыртымашыже
accessibility-heading-level-2 = Шуын кертмаш нерген увер
something-went-wrong = Ала-мо чын огыл лие.
renderer-load-failed = сӱретызым налаш ыш лий. Лаштыкым уэмде.
core-start-failed = Документым ончышым чӱкташ ыш лий. Лаштыкым уэмде.
