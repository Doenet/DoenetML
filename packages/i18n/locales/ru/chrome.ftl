# Russian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: impersonal throughout — verbal nouns for statuses and infinitives
# for controls, never a `ты` form. Where the reader is asked to act — the
# click-to-open pair and the two "reload the page" messages — the `вы`
# imperative does it, which is the polite default Russian software uses and
# the only form those sentences have.
#
# Russian counts in four plural categories, so every countable message below
# selects on all of `one`, `few`, `many` and `other`. `one` covers 21 and 101
# as well as 1, and `many` covers 0 and 5–20 — which is why the "no attempts"
# case is written as an explicit `[0]` rather than left to a category.


## Answer submission

answer-checking = Проверка…
answer-submitting = Отправка…
answer-checking-status = Проверка ответа
answer-submitting-status = Отправка ответа
answer-correct = Верно
answer-incorrect = Неверно
answer-response-saved = Ответ сохранён
answer-percent-credit = { $percent } % зачёта
answer-percent-correct = { $percent } % верно
answer-percent-short = { $percent } %
max-credit-available = Максимально возможный зачёт: { $percent } %
attempts-remaining =
    { $count ->
        [0] попыток не осталось
        [one] осталась { $count } попытка
        [few] осталось { $count } попытки
        [many] осталось { $count } попыток
       *[other] осталось { $count } попытки
    }
validation-correct = (Верно)
validation-incorrect = (Неверно)
validation-partially-correct = (Частично верно)
answer-show-responses =
    { $count ->
        [one] Показать { $count } ответ на { $answerId }
        [few] Показать { $count } ответа на { $answerId }
        [many] Показать { $count } ответов на { $answerId }
       *[other] Показать { $count } ответа на { $answerId }
    }

## Disclosure panels

feedback-heading = Обратная связь
collapsible-click-to-open = (нажмите, чтобы открыть)
collapsible-click-to-close = (нажмите, чтобы закрыть)
collapsible-initializing = Инициализация…
footnote-show = Показать сноску
footnote-hide = Скрыть сноску
description-more-information = подробнее

## Controls

slider-previous = Назад
slider-next = Вперёд
keyboard-open = Открыть клавиатуру
keyboard-close = Закрыть клавиатуру
choice-input-remove-choice = Удалить { $choice }
matrix-remove-row = Удалить строку
matrix-add-row = Добавить строку
matrix-remove-column = Удалить столбец
matrix-add-column = Добавить столбец
subset-add-remove-points = Добавить/удалить точки
subset-toggle-points-intervals = Переключить точки и интервалы
subset-move-points = Переместить точки
subset-clear = Очистить
# A `box` here is one orbital, drawn as a square: `ячейка`.
orbital-add-row = Добавить строку
orbital-remove-row = Удалить строку
orbital-add-box = Добавить ячейку
orbital-remove-box = Удалить ячейку
orbital-add-up-arrow = Добавить стрелку вверх
orbital-add-down-arrow = Добавить стрелку вниз
orbital-remove-arrow = Удалить стрелку
orbital-row-label = Подпись строки { $row }
pretzel-answer = Ответ

## Math input

math-input-preview-region = предварительный просмотр математического выражения
math-input-preview = Просмотр
math-input-invalid-expression = Недопустимое выражение:

## Document status

viewer-initializing = Инициализация…

## Errors

error-heading = Ошибка
error-found-at =
    { $span ->
        [line] Найдена в строке { $startLine }.
       *[lines] Найдена в строках { $startLine }–{ $endLine }.
    }
document-contains-errors = В этом документе есть ошибки!
diagnostic-heading-error = Ошибка
diagnostic-heading-warning = Предупреждение
diagnostic-heading-information = Информация
diagnostic-heading-hint = Подсказка
accessibility-heading-level-1 = Нарушение доступности WCAG AA
accessibility-heading-level-2 = Предупреждение о доступности
something-went-wrong = Что-то пошло не так.
renderer-load-failed = не удалось загрузить компонент отображения. Пожалуйста, перезагрузите страницу.
core-start-failed = Не удалось запустить просмотрщик документа. Пожалуйста, перезагрузите страницу.
