# Ukrainian viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Ukrainian counts in four plural categories — `one`, `few`, `many` and
# `other` — so every `{ $count -> … }` below has four branches where English
# has two. `many` is the one that covers five and up as well as the teens, and
# it takes the genitive plural: «5 спроб», not «5 спроби».
#
# Register: the second-person plural imperative — «Перезавантажте сторінку» —
# which is how Ukrainian software addresses a reader, and which the other two
# namespaces already use throughout («Натисніть», «Задайте», «Запишіть»).


## Answer submission

answer-checking = Перевірка…
answer-submitting = Надсилання…
answer-checking-status = Перевірка відповіді
answer-submitting-status = Надсилання відповіді
answer-correct = Правильно
answer-incorrect = Неправильно
answer-response-saved = Відповідь збережено
answer-percent-credit = { $percent }% зарахування
answer-percent-correct = { $percent }% правильно
answer-percent-short = { $percent } %
max-credit-available = Максимально можливе зарахування: { $percent }%
attempts-remaining =
    { $count ->
        [0] спроб не залишилося
        [one] залишилася { $count } спроба
        [few] залишилося { $count } спроби
        [many] залишилося { $count } спроб
       *[other] залишилося { $count } спроби
    }
validation-correct = (Правильно)
validation-incorrect = (Неправильно)
validation-partially-correct = (Частково правильно)
answer-show-responses =
    { $count ->
        [one] Показати { $count } відповідь на { $answerId }
        [few] Показати { $count } відповіді на { $answerId }
        [many] Показати { $count } відповідей на { $answerId }
       *[other] Показати { $count } відповіді на { $answerId }
    }

## Disclosure panels

feedback-heading = Відгук
collapsible-click-to-open = (натисніть, щоб відкрити)
collapsible-click-to-close = (натисніть, щоб закрити)
collapsible-initializing = Ініціалізація…
footnote-show = Показати виноску
footnote-hide = Сховати виноску
description-more-information = докладніше

## Controls

slider-previous = Назад
slider-next = Далі
keyboard-open = Відкрити клавіатуру
keyboard-close = Закрити клавіатуру
choice-input-remove-choice = Вилучити { $choice }
matrix-remove-row = Вилучити рядок
matrix-add-row = Додати рядок
matrix-remove-column = Вилучити стовпець
matrix-add-column = Додати стовпець
subset-add-remove-points = Додати/вилучити точки
subset-toggle-points-intervals = Перемкнути точки та проміжки
subset-move-points = Пересунути точки
subset-clear = Очистити
orbital-add-row = Додати рядок
orbital-remove-row = Вилучити рядок
orbital-add-box = Додати комірку
orbital-remove-box = Вилучити комірку
orbital-add-up-arrow = Додати стрілку вгору
orbital-add-down-arrow = Додати стрілку вниз
orbital-remove-arrow = Вилучити стрілку
orbital-row-label = Підпис рядка { $row }
pretzel-answer = Відповідь

## Math input

math-input-preview-region = попередній перегляд математичного виразу
math-input-preview = Перегляд
math-input-invalid-expression = Некоректний вираз:

## Document status

viewer-initializing = Ініціалізація…

## Errors

error-heading = Помилка
# Ukrainian has no article and needs none of English's; the sentence is the
# same shape either way, so the two branches differ only in the number of line
# numbers they name.
error-found-at =
    { $span ->
        [line] Виявлено в рядку { $startLine }.
       *[lines] Виявлено в рядках { $startLine }–{ $endLine }.
    }
document-contains-errors = Цей документ містить помилки!
diagnostic-heading-error = Помилка
diagnostic-heading-warning = Попередження
diagnostic-heading-information = Інформація
diagnostic-heading-hint = Підказка
accessibility-heading-level-1 = Порушення доступності WCAG AA
accessibility-heading-level-2 = Зауваження щодо доступності
something-went-wrong = Щось пішло не так.
renderer-load-failed = не вдалося завантажити модуль відображення. Перезавантажте сторінку.
core-start-failed = Не вдалося запустити переглядач документа. Перезавантажте сторінку.
