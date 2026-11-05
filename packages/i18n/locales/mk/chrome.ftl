# Macedonian viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Macedonian counts in two plural categories, but they do not line up with
# English's: `one` here is any number ending in 1 other than 11, so 21 and 101
# take the singular noun and 0 and 11 do not. That is exactly the rule the
# explicit `[0]` branch below protects against — zero falls to `other` on its
# own, but the wording changes for zero as well as the noun.
#
# Register: the second-person plural imperative — «Превчитајте ја страницата».


## Answer submission

answer-checking = Проверување…
answer-submitting = Испраќање…
answer-checking-status = Проверување на одговорот
answer-submitting-status = Испраќање на одговорот
answer-correct = Точно
answer-incorrect = Неточно
answer-response-saved = Одговорот е зачуван
answer-percent-credit = { $percent }% од поените
answer-percent-correct = { $percent }% точно
answer-percent-short = { $percent } %
max-credit-available = Најмногу можни поени: { $percent }%
attempts-remaining =
    { $count ->
        [0] не преостануваат обиди
        [one] преостанува { $count } обид
       *[other] преостануваат { $count } обиди
    }
validation-correct = (Точно)
validation-incorrect = (Неточно)
validation-partially-correct = (Делумно точно)
answer-show-responses =
    { $count ->
        [one] Прикажи { $count } одговор на { $answerId }
       *[other] Прикажи { $count } одговори на { $answerId }
    }

## Disclosure panels

feedback-heading = Повратна информација
collapsible-click-to-open = (кликнете за да отворите)
collapsible-click-to-close = (кликнете за да затворите)
collapsible-initializing = Иницијализирање…
footnote-show = Прикажи ја фуснотата
footnote-hide = Скриј ја фуснотата
description-more-information = повеќе информации

## Controls

slider-previous = Назад
slider-next = Напред
keyboard-open = Отвори ја тастатурата
keyboard-close = Затвори ја тастатурата
choice-input-remove-choice = Отстрани { $choice }
matrix-remove-row = Отстрани ред
matrix-add-row = Додај ред
matrix-remove-column = Отстрани колона
matrix-add-column = Додај колона
subset-add-remove-points = Додај/отстрани точки
subset-toggle-points-intervals = Смени меѓу точки и интервали
subset-move-points = Помести точки
subset-clear = Исчисти
orbital-add-row = Додај ред
orbital-remove-row = Отстрани ред
orbital-add-box = Додај поле
orbital-remove-box = Отстрани поле
orbital-add-up-arrow = Додај стрелка нагоре
orbital-add-down-arrow = Додај стрелка надолу
orbital-remove-arrow = Отстрани стрелка
orbital-row-label = Ознака за ред { $row }
pretzel-answer = Одговор

## Math input

math-input-preview-region = преглед на математичкиот израз
math-input-preview = Преглед
math-input-invalid-expression = Невалиден израз:

## Document status

viewer-initializing = Иницијализирање…

## Errors

error-heading = Грешка
error-found-at =
    { $span ->
        [line] Пронајдена во редот { $startLine }.
       *[lines] Пронајдена во редовите { $startLine }–{ $endLine }.
    }
document-contains-errors = Овој документ содржи грешки!
diagnostic-heading-error = Грешка
diagnostic-heading-warning = Предупредување
diagnostic-heading-information = Информација
diagnostic-heading-hint = Совет
accessibility-heading-level-1 = Прекршување на пристапноста според WCAG AA
accessibility-heading-level-2 = Известување за пристапност
something-went-wrong = Нешто тргна наопаку.
renderer-load-failed = не успеа да се вчита модул за прикажување. Превчитајте ја страницата.
core-start-failed = Прегледувачот на документот не можеше да се стартува. Превчитајте ја страницата.
