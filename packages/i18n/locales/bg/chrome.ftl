# Bulgarian viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Bulgarian counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. `[0]` is
# still spelled out wherever English changes its wording for zero: Bulgarian
# says «не остават опити» rather than a number followed by a noun.
#
# Register: the second-person plural imperative — «Презаредете страницата» —
# which is how Bulgarian software addresses a reader.


## Answer submission

answer-checking = Проверка…
answer-submitting = Изпращане…
answer-checking-status = Проверка на отговора
answer-submitting-status = Изпращане на отговора
answer-correct = Вярно
answer-incorrect = Грешно
answer-response-saved = Отговорът е запазен
answer-percent-credit = { $percent }% от точките
answer-percent-correct = { $percent }% вярно
answer-percent-short = { $percent } %
max-credit-available = Максимални възможни точки: { $percent }%
attempts-remaining =
    { $count ->
        [0] не остават опити
        [one] остава { $count } опит
       *[other] остават { $count } опита
    }
validation-correct = (Вярно)
validation-incorrect = (Грешно)
validation-partially-correct = (Частично вярно)
answer-show-responses =
    { $count ->
        [one] Показване на { $count } отговор на { $answerId }
       *[other] Показване на { $count } отговора на { $answerId }
    }

## Disclosure panels

feedback-heading = Обратна връзка
collapsible-click-to-open = (щракнете, за да отворите)
collapsible-click-to-close = (щракнете, за да затворите)
collapsible-initializing = Инициализиране…
footnote-show = Показване на бележката
footnote-hide = Скриване на бележката
description-more-information = повече информация

## Controls

slider-previous = Назад
slider-next = Напред
keyboard-open = Отваряне на клавиатурата
keyboard-close = Затваряне на клавиатурата
choice-input-remove-choice = Премахване на { $choice }
matrix-remove-row = Премахване на ред
matrix-add-row = Добавяне на ред
matrix-remove-column = Премахване на стълб
matrix-add-column = Добавяне на стълб
subset-add-remove-points = Добавяне/премахване на точки
subset-toggle-points-intervals = Превключване между точки и интервали
subset-move-points = Местене на точки
subset-clear = Изчистване
orbital-add-row = Добавяне на ред
orbital-remove-row = Премахване на ред
orbital-add-box = Добавяне на клетка
orbital-remove-box = Премахване на клетка
orbital-add-up-arrow = Добавяне на стрелка нагоре
orbital-add-down-arrow = Добавяне на стрелка надолу
orbital-remove-arrow = Премахване на стрелка
orbital-row-label = Надпис за ред { $row }
pretzel-answer = Отговор

## Math input

math-input-preview-region = преглед на математическия израз
math-input-preview = Преглед
math-input-invalid-expression = Невалиден израз:

## Document status

viewer-initializing = Инициализиране…

## Errors

error-heading = Грешка
error-found-at =
    { $span ->
        [line] Намерена на ред { $startLine }.
       *[lines] Намерена на редове { $startLine }–{ $endLine }.
    }
document-contains-errors = Този документ съдържа грешки!
diagnostic-heading-error = Грешка
diagnostic-heading-warning = Предупреждение
diagnostic-heading-information = Информация
diagnostic-heading-hint = Подсказка
accessibility-heading-level-1 = Нарушение на достъпността по WCAG AA
accessibility-heading-level-2 = Сигнал за достъпност
something-went-wrong = Нещо се обърка.
renderer-load-failed = не успя да се зареди модул за изобразяване. Презаредете страницата.
core-start-failed = Визуализаторът на документа не можа да бъде стартиран. Презаредете страницата.
